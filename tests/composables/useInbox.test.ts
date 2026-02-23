import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInbox } from '../../client/composables/useInbox'
import * as vuefire from 'vuefire'
import * as firestore from 'firebase/firestore'

// Mock dependencies
vi.mock('firebase/firestore', () => {
    return {
        collection: vi.fn(),
        doc: vi.fn(),
        getDoc: vi.fn(),
        getDocs: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
        orderBy: vi.fn(),
        limit: vi.fn(),
        setDoc: vi.fn(),
        addDoc: vi.fn(),
        updateDoc: vi.fn(),
        onSnapshot: vi.fn(),
        writeBatch: vi.fn(),
        serverTimestamp: vi.fn()
    }
})

vi.mock('vuefire', () => ({
    useCurrentUser: vi.fn(),
    useFirestore: vi.fn()
}))

describe('useInbox Composable', () => {
    let mockBatch: any

    beforeEach(() => {
        vi.clearAllMocks()

        // Mock user
        ;(vuefire.useCurrentUser as any).mockReturnValue({ value: { uid: 'test-user' } })

        // Mock db
        ;(vuefire.useFirestore as any).mockReturnValue({})

        // Mock writeBatch
        mockBatch = {
            update: vi.fn(),
            commit: vi.fn().mockResolvedValue(undefined)
        }
        ;(firestore.writeBatch as any).mockReturnValue(mockBatch)

        // Mock doc
        ;(firestore.doc as any).mockImplementation((db: any, path: string, id?: string) => {
            // If id is provided separately (doc(db, col, id))
            if (id) return { path: `${path}/${id}`, id }
            // If path includes id (doc(db, path))
            return { path, id: path.split('/').pop() }
        })

        // Mock updateDoc for the initial implementation test (if needed)
        ;(firestore.updateDoc as any).mockResolvedValue(undefined)
    })

    it('markAllRead should use batch write', async () => {
        const { markAllRead, inbox } = useInbox()

        // Simulate inbox data
        inbox.value = [
            { id: '1', read: false } as any,
            { id: '2', read: false } as any,
            { id: '3', read: true } as any
        ]

        await markAllRead()

        // Verify writeBatch was called
        expect(firestore.writeBatch).toHaveBeenCalled()

        // Verify updates were added to batch
        expect(mockBatch.update).toHaveBeenCalledTimes(2) // Only 2 unread messages

        // Verify the correct documents were updated
        const updateCalls = mockBatch.update.mock.calls
        const updatedIds = updateCalls.map((call: any) => call[0].id)

        expect(updatedIds).toContain('1')
        expect(updatedIds).toContain('2')
        expect(updatedIds).not.toContain('3')

        // Verify batch was committed
        expect(mockBatch.commit).toHaveBeenCalled()
    })

    it('markAllRead should chunk large updates (e.g. 505 messages)', async () => {
        const { markAllRead, inbox } = useInbox()

        // Create 505 unread messages
        const unreadMessages = Array.from({ length: 505 }, (_, i) => ({ id: `${i}`, read: false }))
        inbox.value = unreadMessages as any

        await markAllRead()

        // Verify writeBatch was called twice (500 + 5)
        expect(firestore.writeBatch).toHaveBeenCalledTimes(2)

        // Verify commits were called twice
        expect(mockBatch.commit).toHaveBeenCalledTimes(2)

        // Verify total updates
        expect(mockBatch.update).toHaveBeenCalledTimes(505)
    })
})
