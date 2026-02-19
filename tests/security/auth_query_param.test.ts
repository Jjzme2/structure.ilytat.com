import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies (hoisted)
const { mockVerifyIdToken } = vi.hoisted(() => {
  return { mockVerifyIdToken: vi.fn() }
})

vi.mock('firebase-admin/auth', () => {
  return {
    getAuth: vi.fn(() => ({
      verifyIdToken: mockVerifyIdToken
    }))
  }
})

// Stub globals for Nuxt auto-imports
global.getHeader = vi.fn()
global.getQuery = vi.fn()
global.getRequestURL = vi.fn()
global.createError = (err) => {
  const e = new Error(err.statusMessage || 'Error')
  e.statusCode = err.statusCode || 500
  e.statusMessage = err.statusMessage || 'Error'
  return e
}

describe('Auth Query Param Security', () => {
  let requireAuth

  beforeEach(async () => {
    vi.clearAllMocks()
    mockVerifyIdToken.mockReset()

    // Import the module under test
    const mod = await import('../../server/utils/auth')
    requireAuth = mod.requireAuth
  })

  it('should deny query param token on non-download endpoints', async () => {
    const event = {}

    // Simulate request to Admin API (should be denied)
    global.getRequestURL.mockReturnValue(new URL('http://localhost:3000/api/admin/users'))
    global.getHeader.mockReturnValue(null) // No bearer header
    global.getQuery.mockReturnValue({ token: 'valid-token' })

    mockVerifyIdToken.mockResolvedValue({ uid: 'user123' })

    try {
        await requireAuth(event)
        expect.fail('Should have thrown Unauthorized error for query param on non-download endpoint')
    } catch (error) {
        expect(error.statusCode).toBe(401)
        expect(error.statusMessage).toContain('Missing or invalid token')
    }
  })

  it('should allow query param token on download endpoint', async () => {
    const event = {}

    // Simulate request to Download API (should be allowed)
    global.getRequestURL.mockReturnValue(new URL('http://localhost:3000/api/documents/download'))
    global.getHeader.mockReturnValue(null)
    global.getQuery.mockReturnValue({ token: 'valid-token' })

    mockVerifyIdToken.mockResolvedValue({ uid: 'user123' })

    const user = await requireAuth(event)
    expect(user.uid).toBe('user123')
  })
})
