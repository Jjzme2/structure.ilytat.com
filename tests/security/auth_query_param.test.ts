import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock firebase-admin/auth
const verifyIdTokenMock = vi.fn()
vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    verifyIdToken: verifyIdTokenMock
  })
}))

// Mock Nuxt/H3 globals
global.createError = (err: any) => {
  const e = new Error(err.statusMessage || 'Error')
  // @ts-ignore
  e.statusCode = err.statusCode
  // @ts-ignore
  e.statusMessage = err.statusMessage
  return e
}
global.getQuery = vi.fn()
global.getHeader = vi.fn()
global.getRequestURL = vi.fn()

// Import the module under test
import { requireAuth } from '../../server/utils/auth'

describe('requireAuth Security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    verifyIdTokenMock.mockResolvedValue({ uid: 'test-user' })
  })

  it('should allow query param auth for /api/documents/download', async () => {
    // Setup mocks
    global.getRequestURL.mockReturnValue({ pathname: '/api/documents/download' })
    global.getQuery.mockReturnValue({ token: 'valid-token' })
    global.getHeader.mockReturnValue(undefined)

    const user = await requireAuth({})
    expect(user).toEqual({ uid: 'test-user' })
    expect(verifyIdTokenMock).toHaveBeenCalledWith('valid-token')
  })

  it('should block query param auth for other paths', async () => {
    // Setup mocks for a different path
    global.getRequestURL.mockReturnValue({ pathname: '/api/some/sensitive/endpoint' })
    global.getQuery.mockReturnValue({ token: 'valid-token' })
    global.getHeader.mockReturnValue(undefined)

    // Should fail because query param auth is only allowed for /api/documents/download
    await expect(requireAuth({})).rejects.toThrow('Unauthorized: Missing or invalid token')
    expect(verifyIdTokenMock).not.toHaveBeenCalled()
  })

  it('should allow Authorization header auth for any path', async () => {
    // Setup mocks
    global.getRequestURL.mockReturnValue({ pathname: '/api/any/path' })
    global.getQuery.mockReturnValue({})
    global.getHeader.mockReturnValue('Bearer header-token')

    const user = await requireAuth({})
    expect(user).toEqual({ uid: 'test-user' })
    expect(verifyIdTokenMock).toHaveBeenCalledWith('header-token')
  })
})
