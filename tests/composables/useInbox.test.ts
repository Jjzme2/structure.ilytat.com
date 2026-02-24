import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInbox } from '../../client/composables/useInbox'
import * as vuefire from 'vuefire'
import * as firestore from 'firebase/firestore'

// Mock dependencies
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    updateDoc: vi.fn(),
    writeBatch: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    onSnapshot: vi.fn(),
    addDoc: vi.fn(),
    serverTimestamp: vi.fn(),
    getDocs: vi.fn(),
    getDoc: vi.fn()
}))

vi.mock('vuefire', () => ({
    useCurrentUser: vi.fn(),
    useFirestore: vi.fn()
}))

describe('useInbox Composable', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Mock user
        ;(vuefire.useCurrentUser as any).mockReturnValue({ value: { uid: 'test-user' } })

        // Mock db
        ;(vuefire.useFirestore as any).mockReturnValue({})
    })

    it('should use writeBatch for markAllRead', async () => {
        const batchMock = {
            update: vi.fn(),
            commit: vi.fn().mockResolvedValue(undefined)
        }
        ;(firestore.writeBatch as any).mockReturnValue(batchMock)
        ;(firestore.doc as any).mockImplementation((_db: any, ...args: any[]) => {
            return args.join('/')
        })

        const { markAllRead, inbox } = useInbox()

        // Populate inbox manually
        inbox.value = [
            { id: '1', read: false } as any,
            { id: '2', read: false } as any,
            { id: '3', read: true } as any
        ]

        await markAllRead()

        // With the optimization, we expect writeBatch to be used
        expect(firestore.writeBatch).toHaveBeenCalled()
        expect(batchMock.update).toHaveBeenCalledTimes(2) // Only unread ones
        expect(batchMock.commit).toHaveBeenCalledTimes(1)

        // Verify update calls (path and data)
        // Since we mocked doc() to return path, we can check the path
        expect(batchMock.update).toHaveBeenCalledWith('users/test-user/inbox/1', { read: true })
        expect(batchMock.update).toHaveBeenCalledWith('users/test-user/inbox/2', { read: true })
    })
})
