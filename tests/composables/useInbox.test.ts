import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInbox } from '../../client/composables/useInbox'
import * as vuefire from 'vuefire'
import * as firestore from 'firebase/firestore'

// Mock batch
const mockBatch = {
    update: vi.fn(),
    commit: vi.fn()
}

// Mock dependencies
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    onSnapshot: vi.fn(),
    serverTimestamp: vi.fn(),
    writeBatch: vi.fn(() => mockBatch)
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

        // Mock doc to return a path string for verification
        ;(firestore.doc as any).mockImplementation((db: any, path: string, ...args: any[]) => {
             return { path: `${path}/${args.join('/')}` }
        })
    })

    it('markAllRead uses batch write for efficiency', async () => {
        const { inbox, markAllRead } = useInbox()

        // Setup initial state with unread messages
        inbox.value = [
            { id: '1', read: false, to: 'test-user', archived: false, timestamp: { seconds: 100 } },
            { id: '2', read: false, to: 'test-user', archived: false, timestamp: { seconds: 101 } },
            { id: '3', read: true, to: 'test-user', archived: false, timestamp: { seconds: 102 } }
        ] as any

        await markAllRead()

        // Verify batch usage
        expect(firestore.writeBatch).toHaveBeenCalled()
        expect(mockBatch.update).toHaveBeenCalledTimes(2) // 2 unread messages
        expect(mockBatch.commit).toHaveBeenCalledTimes(1) // 1 commit

        // Verify updateDoc is NOT called individually (as it was before optimization)
        expect(firestore.updateDoc).not.toHaveBeenCalled()

        // Verify the correct documents were updated in the batch
        expect(mockBatch.update).toHaveBeenCalledWith(
            expect.objectContaining({ path: 'users/test-user/inbox/1' }),
            { read: true }
        )
        expect(mockBatch.update).toHaveBeenCalledWith(
            expect.objectContaining({ path: 'users/test-user/inbox/2' }),
            { read: true }
        )
    })
})
