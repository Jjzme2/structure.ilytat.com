import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInbox } from '../../client/composables/useInbox'
import * as vuefire from 'vuefire'
import * as firestore from 'firebase/firestore'
import { ref } from 'vue'

// Mock dependencies
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    serverTimestamp: vi.fn(),
    onSnapshot: vi.fn(),
    getDocs: vi.fn(),
    writeBatch: vi.fn()
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

        // Mock doc
        ;(firestore.doc as any).mockImplementation((db: any, path: string, ...segments: string[]) => [path, ...segments].join('/'))
    })

    it('should use writeBatch to mark multiple messages as read', async () => {
        // Setup writeBatch mock
        const mockBatch = {
            update: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            commit: vi.fn().mockResolvedValue(undefined)
        }
        ;(firestore.writeBatch as any).mockReturnValue(mockBatch)

        // Initialize composable
        const { markAllRead, inbox } = useInbox()

        // Set up mock inbox state with some unread messages
        inbox.value = [
            { id: 'msg1', read: false, archived: false } as any,
            { id: 'msg2', read: true, archived: false } as any,
            { id: 'msg3', read: false, archived: false } as any
        ]

        await markAllRead()

        // Verify writeBatch was called
        expect(firestore.writeBatch).toHaveBeenCalledTimes(1)

        // Verify batch.update was called for each UNREAD message
        expect(mockBatch.update).toHaveBeenCalledTimes(2)
        expect(mockBatch.update).toHaveBeenCalledWith('users/test-user/inbox/msg1', { read: true })
        expect(mockBatch.update).toHaveBeenCalledWith('users/test-user/inbox/msg3', { read: true })

        // Verify batch.commit was called
        expect(mockBatch.commit).toHaveBeenCalledTimes(1)
    })

    it('should not call writeBatch if there are no unread messages', async () => {
        // Setup writeBatch mock
        const mockBatch = {
            update: vi.fn(),
            commit: vi.fn().mockResolvedValue(undefined)
        }
        ;(firestore.writeBatch as any).mockReturnValue(mockBatch)

        // Initialize composable
        const { markAllRead, inbox } = useInbox()

        // Set up mock inbox state with NO unread messages
        inbox.value = [
            { id: 'msg1', read: true, archived: false } as any,
            { id: 'msg2', read: true, archived: false } as any
        ]

        await markAllRead()

        // Verify writeBatch was NOT called
        expect(firestore.writeBatch).not.toHaveBeenCalled()
        expect(mockBatch.update).not.toHaveBeenCalled()
        expect(mockBatch.commit).not.toHaveBeenCalled()
    })
})
