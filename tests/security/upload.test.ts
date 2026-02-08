import { describe, it, expect, vi, beforeEach } from 'vitest'
import { r2Client } from '../../server/utils/r2'

// Mock dependencies
vi.mock('../../server/utils/auth', () => ({
  requireAuth: vi.fn().mockResolvedValue({ uid: 'test-user' })
}))

vi.mock('../../server/utils/r2', () => ({
  r2Client: {
    send: vi.fn().mockResolvedValue({})
  },
  R2_BUCKET: 'test-bucket'
}))

// Stub globals for Nuxt auto-imports
global.readMultipartFormData = vi.fn()
global.createError = (err) => {
  const e = new Error(err.statusMessage || 'Error')
  e.statusCode = err.statusCode
  e.statusMessage = err.statusMessage
  return e
}
global.defineEventHandler = (handler) => handler
global.getHeader = vi.fn().mockReturnValue('1000')

describe('Upload Security', () => {
  let uploadHandler

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../../server/api/documents/upload.post')
    uploadHandler = mod.default
  })

  it('should block dangerous file types (e.g., HTML)', async () => {
    global.readMultipartFormData.mockResolvedValue([
      {
        filename: 'malicious.html',
        type: 'text/html',
        data: Buffer.from('<script>alert("xss")</script>')
      }
    ])

    try {
      await uploadHandler({})
      expect.fail('Should have thrown error for dangerous file type')
    } catch (error) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toContain('Invalid file type')
    }
  })

  it('should block executable files (e.g., .exe)', async () => {
    global.readMultipartFormData.mockResolvedValue([
      {
        filename: 'virus.exe',
        type: 'application/x-msdownload',
        data: Buffer.from('executable-content')
      }
    ])

    try {
      await uploadHandler({})
      expect.fail('Should have thrown error for executable file')
    } catch (error) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toContain('Invalid file type')
    }
  })

  it('should block files larger than 5MB', async () => {
    global.readMultipartFormData.mockResolvedValue([
      {
        filename: 'large.pdf',
        type: 'application/pdf',
        data: Buffer.alloc(5 * 1024 * 1024 + 1) // 5MB + 1 byte
      }
    ])

    try {
      await uploadHandler({})
      expect.fail('Should have thrown error for large file')
    } catch (error) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toContain('File too large')
    }
  })

  it('should allow valid file types (e.g., PDF) and sanitize filename', async () => {
    global.readMultipartFormData.mockResolvedValue([
      {
        filename: 'My Document!.pdf', // Contains space and !
        type: 'application/pdf',
        data: Buffer.from('%PDF-1.4')
      }
    ])

    const result = await uploadHandler({})
    expect(result.success).toBe(true)
    expect(result.files).toHaveLength(1)

    // Verify R2 upload call
    expect(r2Client.send).toHaveBeenCalled()
    const callArgs = r2Client.send.mock.calls[0][0].input

    // Check key sanitization
    // Original: "My Document!.pdf"
    // Sanitized: "my-document-.pdf" (space -> -, ! -> removed/replaced)
    // Regex `[^a-zA-Z0-9.\-_]` replaces with `-`
    // So ' ' -> '-', '!' -> '-'
    // Result: "my-document-.pdf"
    expect(callArgs.Key).toMatch(/^documents\/\d+-my-document-.pdf$/)
    expect(callArgs.Key).not.toContain(' ')
    expect(callArgs.Key).not.toContain('!')
  })

  it('should REJECT a fake PDF (executable disguised as PDF)', async () => {
    global.readMultipartFormData.mockResolvedValue([
      {
        filename: 'fake.pdf',
        type: 'application/pdf',
        data: Buffer.from('MZ9000...') // 'MZ' is header for EXE
      }
    ])

    try {
        await uploadHandler({})
        expect.fail('Should have thrown error for invalid file content')
    } catch (error) {
        expect(error.statusCode).toBe(400)
        expect(error.statusMessage).toContain('Invalid file content')
    }
  })

  it('should REJECT request with Content-Length header too large', async () => {
    // 10MB Content-Length
    global.getHeader.mockReturnValue((10 * 1024 * 1024).toString())

    try {
        await uploadHandler({})
        expect.fail('Should have thrown error for payload too large')
    } catch (error) {
        expect(error.statusCode).toBe(413)
        expect(error.statusMessage).toContain('Payload too large')
    }
  })
})
