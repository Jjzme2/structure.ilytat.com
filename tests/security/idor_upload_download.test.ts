import { describe, it, expect, vi, beforeEach } from 'vitest'
import { r2Client } from '../../server/utils/r2'
import { requireAuth } from '../../server/utils/auth'

// Mock dependencies
vi.mock('../../server/utils/auth', () => ({
  requireAuth: vi.fn()
}))

vi.mock('../../server/utils/r2', () => ({
  r2Client: {
    send: vi.fn().mockResolvedValue({
        Body: 'test-content',
        ContentType: 'text/plain',
        ContentLength: 12
    })
  },
  R2_BUCKET: 'test-bucket'
}))

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn().mockReturnValue({
    collection: vi.fn().mockReturnValue({
      add: vi.fn().mockResolvedValue({})
    })
  }),
  FieldValue: {
    serverTimestamp: vi.fn()
  }
}))

// Stub globals for Nuxt auto-imports
global.getQuery = vi.fn()
global.getHeader = vi.fn()
global.setHeader = vi.fn()
global.getRequestIP = vi.fn().mockReturnValue('127.0.0.1')
global.readMultipartFormData = vi.fn()
global.createError = (err) => {
  const e = new Error(err.statusMessage || 'Error')
  e.statusCode = err.statusCode
  e.statusMessage = err.statusMessage
  return e
}
global.defineEventHandler = (handler) => handler

describe('IDOR Security Test', () => {
  let uploadHandler
  let downloadHandler

  beforeEach(async () => {
    vi.clearAllMocks()
    const uploadMod = await import('../../server/api/documents/upload.post')
    uploadHandler = uploadMod.default
    const downloadMod = await import('../../server/api/documents/download.get')
    downloadHandler = downloadMod.default

    // Mock requireAuth to return a test user
    requireAuth.mockResolvedValue({ uid: 'user-123', email: 'user@example.com' })
  })

  it('should upload file with user-scoped key', async () => {
    global.readMultipartFormData.mockResolvedValue([
      {
        filename: 'test.pdf',
        type: 'application/pdf',
        data: Buffer.from('pdf-content')
      }
    ])

    const result = await uploadHandler({})
    expect(result.success).toBe(true)
    expect(r2Client.send).toHaveBeenCalled()
    const callArgs = r2Client.send.mock.calls[0][0].input

    // Expect key to contain user ID
    expect(callArgs.Key).toMatch(/^documents\/users\/user-123\/\d+-test.pdf$/)
  })

  it('should prevent access to another user\'s file', async () => {
    global.getQuery.mockReturnValue({ key: 'documents/users/user-456/secret.pdf' })

    try {
      await downloadHandler({})
      expect.fail('Should have thrown 403 Forbidden')
    } catch (error) {
      expect(error.statusCode).toBe(403)
      // Expect forbidden message
      // Note: The message might be customized later, but status 403 is key
    }
  })

  it('should allow access to own file', async () => {
    global.getQuery.mockReturnValue({ key: 'documents/users/user-123/my-file.pdf' })

    const result = await downloadHandler({})
    // Expect success (mock returns string 'test-content' via Readable stream mock but here we mock it as string for simplicity in r2Client mock above, but wait, download.get returns response.Body as Readable.
    // In the test mock above: Body: 'test-content'.
    // The handler returns response.Body.
    expect(result).toBe('test-content')
  })

  it('should allow access to legacy/public file', async () => {
    global.getQuery.mockReturnValue({ key: 'documents/old-file.pdf' })

    const result = await downloadHandler({})
    expect(result).toBe('test-content')
  })
})
