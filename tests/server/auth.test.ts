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
global.getRequestURL = vi.fn().mockReturnValue({ pathname: '/' }) // Default mock
global.createError = (err) => {
  const e = new Error(err.statusMessage || 'Error')
  e.statusCode = err.statusCode || 500
  e.statusMessage = err.statusMessage || 'Error'
  return e
}

describe('Auth Utilities', () => {
  let requireAdmin
  let requireAuth

  beforeEach(async () => {
    vi.clearAllMocks()

    // Reset mock implementation
    mockVerifyIdToken.mockReset()

    // Dynamic import to ensure mocks are used
    const mod = await import('../../server/utils/auth')
    requireAdmin = mod.requireAdmin
    requireAuth = mod.requireAuth
  })

  it('should allow access for users with admin claim', async () => {
    const event = {}
    global.getHeader.mockReturnValue('Bearer valid-token')

    mockVerifyIdToken.mockResolvedValue({
      uid: 'user123',
      email: 'user@example.com',
      admin: true
    })

    const user = await requireAdmin(event)
    expect(user.uid).toBe('user123')
    expect(user.admin).toBe(true)
  })

  it('should allow access for users with admin role', async () => {
    const event = {}
    global.getHeader.mockReturnValue('Bearer valid-token')
    mockVerifyIdToken.mockResolvedValue({
      uid: 'user123',
      email: 'user@example.com',
      role: 'admin'
    })

    const user = await requireAdmin(event)
    expect(user.uid).toBe('user123')
    expect(user.role).toBe('admin')
  })

  it('should allow access for hardcoded admin emails (legacy support)', async () => {
    const event = {}
    global.getHeader.mockReturnValue('Bearer valid-token')
    mockVerifyIdToken.mockResolvedValue({
      uid: 'jj-uid',
      email: 'jj@ilytat.com',
      role: 'member' // Not admin role, but email is whitelisted
    })

    const user = await requireAdmin(event)
    expect(user.email).toBe('jj@ilytat.com')
  })

  it('should deny access for regular users without admin claims', async () => {
    const event = {}
    global.getHeader.mockReturnValue('Bearer valid-token')
    mockVerifyIdToken.mockResolvedValue({
      uid: 'user123',
      email: 'user@example.com',
      role: 'member'
    })

    try {
      await requireAdmin(event)
      expect.fail('Should have thrown Forbidden error')
    } catch (error) {
      expect(error.statusCode).toBe(403)
      expect(error.statusMessage).toBe('Forbidden')
    }
  })

  it('should deny access if token is invalid (handled by requireAuth)', async () => {
    const event = {}
    global.getHeader.mockReturnValue('Bearer invalid-token')
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'))

    try {
      await requireAdmin(event)
      expect.fail('Should have thrown Unauthorized error')
    } catch (error) {
      expect(error.statusCode).toBe(401)
      expect(error.statusMessage).toContain('Unauthorized')
    }
  })

  it('should deny access if no token provided', async () => {
    const event = {}
    global.getHeader.mockReturnValue(null)
    global.getQuery.mockReturnValue({})

    try {
      await requireAdmin(event)
      expect.fail('Should have thrown Unauthorized error')
    } catch (error) {
      expect(error.statusCode).toBe(401)
      expect(error.statusMessage).toContain('Missing or invalid token')
    }
  })
})
