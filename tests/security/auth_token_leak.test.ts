import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn().mockReturnValue({
    verifyIdToken: vi.fn().mockImplementation((token) => {
      if (token === 'valid-token') return Promise.resolve({ uid: 'user1' })
      throw new Error('Invalid token')
    })
  })
}))

// Stub globals for Nuxt auto-imports
global.getHeader = vi.fn()
global.getQuery = vi.fn()
global.getRequestURL = vi.fn()
global.createError = (err) => {
  const e = new Error(err.statusMessage || 'Error')
  e.statusCode = err.statusCode
  e.statusMessage = err.statusMessage
  return e
}

describe('Auth Token Leak Prevention', () => {
  let requireAuth

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../../server/utils/auth')
    requireAuth = mod.requireAuth
  })

  it('should allow token in query param for download endpoint', async () => {
    global.getHeader.mockReturnValue(undefined)
    global.getQuery.mockReturnValue({ token: 'valid-token' })
    global.getRequestURL.mockReturnValue({ pathname: '/api/documents/download' })

    const user = await requireAuth({})
    expect(user.uid).toBe('user1')
  })

  it('should REJECT token in query param for other endpoints', async () => {
    global.getHeader.mockReturnValue(undefined)
    global.getQuery.mockReturnValue({ token: 'valid-token' })
    global.getRequestURL.mockReturnValue({ pathname: '/api/admin/invite' })

    try {
      await requireAuth({})
      expect.fail('Should have thrown error: Unauthorized')
    } catch (error) {
      expect(error.statusCode).toBe(401)
      expect(error.statusMessage).toContain('Unauthorized')
    }
  })
})
