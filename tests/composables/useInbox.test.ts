import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInbox } from '../../client/composables/useInbox'
import * as vuefire from 'vuefire'
import * as firestore from 'firebase/firestore'

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
    onSnapshot: vi.fn(),
    writeBatch: vi.fn(),
    serverTimestamp: vi.fn()
}))

vi.mock('vuefire', () => ({
    useCurrentUser: vi.fn(),
    useFirestore: vi.fn()
}))

describe('useInbox Composable', () => {
    let batchMock: any

    beforeEach(() => {
        vi.clearAllMocks()

        // Mock user
        ;(vuefire.useCurrentUser as any).mockReturnValue({ value: { uid: 'test-user' } })

        // Mock db
        ;(vuefire.useFirestore as any).mockReturnValue({})

        // Mock batch
        batchMock = {
            update: vi.fn(),
            commit: vi.fn().mockResolvedValue(undefined)
        }
        ;(firestore.writeBatch as any).mockReturnValue(batchMock)
    })

    it('should mark all read using batch', async () => {
        const { markAllRead, inbox } = useInbox()

        // Simulate populated inbox
        inbox.value = [
            { id: '1', read: false, to: 'u1', archived: false },
            { id: '2', read: false, to: 'u1', archived: false },
            { id: '3', read: true, to: 'u1', archived: false } // Already read
        ] as any

        await markAllRead()

        // Should use writeBatch
        expect(firestore.writeBatch).toHaveBeenCalledTimes(1)

        // Should update only unread items (2 unread items)
        expect(batchMock.update).toHaveBeenCalledTimes(2)

        // Should commit
        expect(batchMock.commit).toHaveBeenCalledTimes(1)

        // Should NOT use individual updateDoc
        expect(firestore.updateDoc).not.toHaveBeenCalled()
    })
})
