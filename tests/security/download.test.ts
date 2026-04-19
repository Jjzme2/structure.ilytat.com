import { describe, it, expect, vi, beforeEach } from 'vitest'
import { r2Client } from '../../server/utils/r2'

// Mock dependencies
vi.mock('../../server/utils/auth', () => ({
  requireAuth: vi.fn().mockResolvedValue({ uid: 'test-user' })
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
global.createError = (err) => {
  const e = new Error(err.statusMessage || 'Error')
  e.statusCode = err.statusCode
  e.statusMessage = err.statusMessage
  return e
}
global.defineEventHandler = (handler) => handler

describe('Download Security', () => {
  let downloadHandler

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../../server/api/documents/download.get')
    downloadHandler = mod.default
  })

  it('should block path traversal attempts (e.g., ../)', async () => {
    global.getQuery.mockReturnValue({ key: '../../etc/passwd' })

    try {
      await downloadHandler({})
      expect.fail('Should have thrown error for path traversal attempt')
    } catch (error) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toContain('Invalid file key')
    }
  })

  it('should block absolute paths (e.g., /etc/passwd)', async () => {
    global.getQuery.mockReturnValue({ key: '/etc/passwd' })

    try {
      await downloadHandler({})
      expect.fail('Should have thrown error for absolute path')
    } catch (error) {
        expect(error.statusCode).toBe(400)
        expect(error.statusMessage).toContain('Invalid file key')
    }
  })

  it('should allow valid keys (e.g., documents/file.pdf)', async () => {
    global.getQuery.mockReturnValue({ key: 'documents/test-file.pdf' })

    const result = await downloadHandler({})
    expect(result).toBe('test-content')

    // Verify R2 download call
    expect(r2Client.send).toHaveBeenCalled()
    const callArgs = r2Client.send.mock.calls[0][0].input

    expect(callArgs.Key).toBe('documents/test-file.pdf')
    expect(callArgs.Bucket).toBe('test-bucket')
  })

  it('should block access to other users scoped documents', async () => {
    global.getQuery.mockReturnValue({ key: 'documents/users/other-user/file.pdf' })

    try {
      await downloadHandler({})
      expect.fail('Should have thrown error for access denied')
    } catch (error) {
        expect(error.statusCode).toBe(403)
        expect(error.statusMessage).toContain('Access Denied')
    }
  })
})
