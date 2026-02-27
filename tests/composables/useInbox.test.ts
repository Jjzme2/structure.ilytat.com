import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInbox } from '../../client/composables/useInbox'
import * as vuefire from 'vuefire'
import * as firestore from 'firebase/firestore'
import { ref } from 'vue'

// Mock dependencies
vi.mock('firebase/firestore', () => {
    const originalModule = vi.importActual('firebase/firestore')
    return {
        ...originalModule,
        collection: vi.fn(),
        doc: vi.fn(),
        getDocs: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
        orderBy: vi.fn(),
        limit: vi.fn(),
        addDoc: vi.fn(),
        updateDoc: vi.fn(),
        onSnapshot: vi.fn(),
        serverTimestamp: vi.fn(),
        writeBatch: vi.fn()
    }
})

vi.mock('vuefire', () => ({
    useCurrentUser: vi.fn(),
    useFirestore: vi.fn()
}))

// Mock Nuxt auto-imports
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', (fn: any) => {
    const val = ref(fn())
    return val
})

describe('useInbox Composable', () => {
    let mockBatch: any

    beforeEach(() => {
        vi.clearAllMocks()

        // Mock user
        ;(vuefire.useCurrentUser as any).mockReturnValue({ value: { uid: 'test-user' } })

        // Mock db
        ;(vuefire.useFirestore as any).mockReturnValue({})

        // Mock batch
        mockBatch = {
            update: vi.fn(),
            commit: vi.fn().mockResolvedValue(undefined)
        };
        (firestore.writeBatch as any).mockReturnValue(mockBatch)
    })

    it('should initialize and fetch inbox', () => {
        const { init } = useInbox()
        // We can't easily test the snapshot callback without more complex mocking,
        // but we can verify it sets up the query.

        init()

        expect(firestore.collection).toHaveBeenCalled()
        expect(firestore.query).toHaveBeenCalled()
        expect(firestore.onSnapshot).toHaveBeenCalled()
    })

    it('should batch updates when marking all as read', async () => {
        const { inbox, markAllRead } = useInbox()

        // Manually populate inbox for testing
        // Since `inbox` is a ref, we can set it directly.
        inbox.value = [
            { id: 'msg1', read: false, to: 'test-user', timestamp: {} as any, archived: false },
            { id: 'msg2', read: false, to: 'test-user', timestamp: {} as any, archived: false },
            { id: 'msg3', read: true, to: 'test-user', timestamp: {} as any, archived: false } // Already read
        ] as any

        await markAllRead()

        expect(firestore.writeBatch).toHaveBeenCalled()
        expect(mockBatch.update).toHaveBeenCalledTimes(2) // Should only update the 2 unread messages
        expect(mockBatch.commit).toHaveBeenCalledTimes(1)
        expect(firestore.updateDoc).not.toHaveBeenCalled()
    })

    it('should not call batch commit if there are no unread messages', async () => {
        const { inbox, markAllRead } = useInbox()

        inbox.value = [
            { id: 'msg1', read: true, to: 'test-user', timestamp: {} as any, archived: false },
        ] as any

        await markAllRead()

        expect(firestore.writeBatch).not.toHaveBeenCalled()
    })
})
