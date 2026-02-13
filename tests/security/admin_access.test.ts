import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Firestore
const mockCollection = {
  doc: vi.fn().mockReturnThis(),
  collection: vi.fn().mockReturnThis(),
  get: vi.fn().mockResolvedValue({ docs: [] }),
  add: vi.fn().mockResolvedValue({ id: 'new-id' }),
  set: vi.fn().mockResolvedValue({}),
  delete: vi.fn().mockResolvedValue({}),
}

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn().mockReturnValue({
    collection: vi.fn().mockReturnValue(mockCollection)
  })
}))

// Mock Auth Utils - Keep requireAdmin real, mock requireAuth
vi.mock('../../server/utils/auth', async (importOriginal) => {
  const actual: any = await importOriginal()
  return {
    ...actual,
    requireAuth: vi.fn()
  }
})

import { requireAuth } from '../../server/utils/auth'

// Stub globals for Nuxt
global.readBody = vi.fn()
global.getQuery = vi.fn()
global.getHeader = vi.fn()
global.createError = (err) => {
  const e: any = new Error(err.statusMessage || 'Error')
  e.statusCode = err.statusCode
  e.statusMessage = err.statusMessage
  return e
}
global.defineEventHandler = (handler) => handler

describe('Admin Access Security - Groups Endpoint', () => {
  let groupsHandler: any

  beforeEach(async () => {
    vi.clearAllMocks()
    // Dynamic import to ensure mocks are applied
    const mod = await import('../../server/api/admin/groups')
    groupsHandler = mod.default
  })

  it('should allow access to admin by role', async () => {
    // Mock authenticated admin user
    (requireAuth as any).mockResolvedValue({
      uid: 'admin-user',
      email: 'user@example.com',
      role: 'admin'
    })

    const event = { method: 'GET' }
    const result = await groupsHandler(event)

    // Should return array (mocked empty list)
    expect(Array.isArray(result)).toBe(true)
  })

  it('should allow access to admin by claim', async () => {
    // Mock authenticated admin user
    (requireAuth as any).mockResolvedValue({
      uid: 'admin-user',
      email: 'user@example.com',
      admin: true
    })

    const event = { method: 'GET' }
    const result = await groupsHandler(event)

    expect(Array.isArray(result)).toBe(true)
  })

  it('should allow access to legacy hardcoded admin', async () => {
    // Mock authenticated admin user
    (requireAuth as any).mockResolvedValue({
      uid: 'legacy-admin',
      email: 'jj@ilytat.com',
    })

    const event = { method: 'GET' }
    const result = await groupsHandler(event)

    expect(Array.isArray(result)).toBe(true)
  })

  it('should BLOCK access to non-admin user', async () => {
    // Mock authenticated regular user
    (requireAuth as any).mockResolvedValue({
      uid: 'regular-user',
      email: 'user@example.com',
      role: 'member'
    })

    const event = { method: 'GET' }

    try {
      await groupsHandler(event)
      expect.fail('Should have thrown 403 Forbidden')
    } catch (error: any) {
      expect(error.statusCode).toBe(403)
      expect(error.statusMessage).toContain('Forbidden')
    }
  })

  it('should BLOCK access to user with no role', async () => {
    // Mock authenticated regular user
    (requireAuth as any).mockResolvedValue({
      uid: 'regular-user',
      email: 'user@example.com'
    })

    const event = { method: 'GET' }

    try {
      await groupsHandler(event)
      expect.fail('Should have thrown 403 Forbidden')
    } catch (error: any) {
      expect(error.statusCode).toBe(403)
      expect(error.statusMessage).toContain('Forbidden')
    }
  })
})
