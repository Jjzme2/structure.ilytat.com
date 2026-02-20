import { describe, it, expect, vi, beforeEach } from 'vitest'
import { r2Client } from '../../server/utils/r2'

// Mock dependencies
vi.mock('../../server/utils/auth', () => ({
  requireAuth: vi.fn().mockResolvedValue({ uid: 'test-user' })
}))

vi.mock('../../server/utils/r2', () => ({
  r2Client: {
    send: vi.fn().mockResolvedValue({
        Contents: [
            { Key: 'documents/123-legacy.txt', Size: 100, LastModified: new Date() },
            { Key: 'documents/users/test-user/456-user.txt', Size: 200, LastModified: new Date() },
            { Key: 'documents/users/other-user/789-other.txt', Size: 300, LastModified: new Date() },
            { Key: 'documents/some-other-folder/file.txt', Size: 400, LastModified: new Date() }
        ]
    })
  },
  R2_BUCKET: 'test-bucket'
}))

// Stub globals for Nuxt auto-imports
global.defineEventHandler = (handler) => handler
global.createError = (err) => err

describe('List Documents Security', () => {
  let listHandler

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../../server/api/documents/list.get')
    listHandler = mod.default
  })

  it('should only return legacy files and files owned by the user', async () => {
    const result = await listHandler({})

    expect(result).toHaveLength(3) // Legacy, User, Other Folder (legacy behavior)

    const keys = result.map(f => f.key)
    expect(keys).toContain('documents/123-legacy.txt')
    expect(keys).toContain('documents/users/test-user/456-user.txt')
    expect(keys).toContain('documents/some-other-folder/file.txt')

    // Should filter out other user's file
    expect(keys).not.toContain('documents/users/other-user/789-other.txt')
  })
})
