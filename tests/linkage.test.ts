import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '../client/stores/tasks'
import * as vuefire from 'vuefire'
import * as firestore from 'firebase/firestore'

// Mocking Firebase
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    serverTimestamp: vi.fn(() => new Date()),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn()
}))

vi.mock('vuefire', () => ({
    useCurrentUser: vi.fn(),
    useFirestore: vi.fn()
}))

vi.mock('~/composables/useActivityLog', () => ({
    useActivityLog: vi.fn(() => ({
        log: vi.fn()
    }))
}))

describe('Tasks Store - Strategic Linkage', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()

            // Mock user
            ; (vuefire.useCurrentUser as any).mockReturnValue({ value: { uid: 'test-user' } })
            ; (vuefire.useFirestore as any).mockReturnValue({})
    })

    it('should link a task to an OKR', async () => {
        const store = useTasksStore()
        const taskId = 'task-123'
        const okrId = 'okr-456'
        const krId = 'kr-789'

        await store.linkToOKR(taskId, okrId, krId)

        expect(firestore.updateDoc).toHaveBeenCalledWith(
            undefined, // docRef mock return
            expect.objectContaining({
                okrId,
                krId
            })
        )
    })

    it('should unlink a task from an OKR', async () => {
        const store = useTasksStore()
        const taskId = 'task-123'

        await store.unlinkFromOKR(taskId)

        expect(firestore.updateDoc).toHaveBeenCalledWith(
            undefined,
            expect.objectContaining({
                okrId: null,
                krId: null
            })
        )
    })
})
