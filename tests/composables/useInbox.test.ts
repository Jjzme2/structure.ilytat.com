import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInbox } from '../../client/composables/useInbox'
import * as vuefire from 'vuefire'
import * as firestore from 'firebase/firestore'
import { ref } from 'vue'

// Mock dependencies
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    serverTimestamp: vi.fn(),
    onSnapshot: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
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
        ;(firestore.doc as any).mockImplementation((db: any, path: string, id: string) => ({ path, id }))
    })

    it('should chunk unread messages into batches of 500 when marking all as read', async () => {
        // Setup mock batch
        const mockUpdate = vi.fn()
        const mockCommit = vi.fn()
        ;(firestore.writeBatch as any).mockReturnValue({
            update: mockUpdate,
            commit: mockCommit
        })

        const { markAllRead, inbox } = useInbox()

        // Generate 1200 unread messages
        const mockMessages = Array.from({ length: 1200 }, (_, i) => ({
            id: `msg-${i}`,
            read: false,
            archived: false,
            from: 'system',
            to: 'test-user',
            subject: `Test ${i}`,
            body: 'Hello',
            timestamp: new Date()
        }))

        inbox.value = mockMessages

        await markAllRead()

        // writeBatch should be called 3 times (1200 / 500 = 2.4 -> 3 batches)
        expect(firestore.writeBatch).toHaveBeenCalledTimes(3)

        // update should be called 1200 times in total
        expect(mockUpdate).toHaveBeenCalledTimes(1200)

        // commit should be called 3 times
        expect(mockCommit).toHaveBeenCalledTimes(3)
    })
})
