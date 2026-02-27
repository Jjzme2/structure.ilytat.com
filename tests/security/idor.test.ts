import { describe, it, expect, vi, beforeEach } from 'vitest'
import { r2Client } from '../../server/utils/r2'

// Mock dependencies
const mockUserA = { uid: 'user-a', email: 'user-a@example.com' }
const mockUserB = { uid: 'user-b', email: 'user-b@example.com' }

// Mock r2 client before imports
vi.mock('../../server/utils/r2', () => ({
  r2Client: {
    send: vi.fn()
  },
  R2_BUCKET: 'test-bucket'
}))

// Mock Firestore
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

// Mock auth - this needs to be mocked correctly for the test file scope
vi.mock('../../server/utils/auth', () => ({
  requireAuth: vi.fn(),
  checkIsAdmin: vi.fn()
}))

import { requireAuth, checkIsAdmin } from '../../server/utils/auth'

// Stub globals for Nuxt auto-imports
global.getQuery = vi.fn()
global.getHeader = vi.fn()
global.setHeader = vi.fn()
global.getRequestIP = vi.fn().mockReturnValue('127.0.0.1')
global.createError = (options) => {
  const err = new Error(options.statusMessage || 'Error')
  err.statusCode = options.statusCode
  err.statusMessage = options.statusMessage
  return err
}
global.defineEventHandler = (handler) => handler

describe('IDOR Security', () => {
  let listHandler
  let downloadHandler

  beforeEach(async () => {
    vi.clearAllMocks()

    // Import handlers dynamically to ensure fresh mocks
    const listMod = await import('../../server/api/documents/list.get')
    listHandler = listMod.default

    const downloadMod = await import('../../server/api/documents/download.get')
    downloadHandler = downloadMod.default

    // Default mock implementation
    checkIsAdmin.mockReturnValue(false)
  })

  describe('List Endpoint', () => {
    it('should filter files by user ID (prevent listing others files)', async () => {
      // Simulate User B (Attacker)
      requireAuth.mockResolvedValue(mockUserB)

      // Mock S3 response
      r2Client.send.mockResolvedValue({
        Contents: []
      })

      // Act
      await listHandler({})

      // Assert (Secure Behavior)
      // Check that the S3 command included a Prefix for the specific user
      const s3CallArgs = r2Client.send.mock.calls[0][0].input
      expect(s3CallArgs.Prefix).toBe(`documents/users/${mockUserB.uid}/`)
    })
  })

  describe('Download Endpoint', () => {
    it('should prevent User B from downloading User As file', async () => {
      // Simulate User B (Attacker)
      requireAuth.mockResolvedValue(mockUserB)
      global.getQuery.mockReturnValue({ key: 'documents/users/user-a/secret.pdf' })

      // Mock successful S3 retrieval (vulnerability condition if check missing)
      r2Client.send.mockResolvedValue({
        Body: 'secret-content',
        ContentType: 'application/pdf'
      })

      // Act & Assert
      try {
        await downloadHandler({})
        expect.fail('Should have thrown 403 Forbidden')
      } catch (error) {
        expect(error.statusCode).toBe(403)
        expect(error.message).toMatch(/Forbidden|Access denied/)
      }
    })

    it('should allow User A to download their own file', async () => {
      // Simulate User A
      requireAuth.mockResolvedValue(mockUserA)
      global.getQuery.mockReturnValue({ key: 'documents/users/user-a/secret.pdf' })

      r2Client.send.mockResolvedValue({
        Body: 'secret-content',
        ContentType: 'application/pdf'
      })

      // Act
      const result = await downloadHandler({})

      // Assert
      expect(result).toBe('secret-content')
    })

    it('should allow Admin to download any file', async () => {
        // Simulate Admin User
        const adminUser = { ...mockUserB, role: 'admin' }
        requireAuth.mockResolvedValue(adminUser)
        checkIsAdmin.mockReturnValue(true) // Mock admin check success

        global.getQuery.mockReturnValue({ key: 'documents/users/user-a/secret.pdf' })

        r2Client.send.mockResolvedValue({
          Body: 'secret-content',
          ContentType: 'application/pdf'
        })

        // Act
        const result = await downloadHandler({})

        // Assert
        expect(result).toBe('secret-content')
      })
  })
})
