import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDaily } from '../../client/composables/useDaily'
import * as vuefire from 'vuefire'
import * as firestore from 'firebase/firestore'

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
    setDoc: vi.fn()
}))

vi.mock('vuefire', () => ({
    useCurrentUser: vi.fn(),
    useFirestore: vi.fn()
}))

describe('useDaily Composable', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Mock user
        ;(vuefire.useCurrentUser as any).mockReturnValue({ value: { uid: 'test-user' } })

        // Mock db
        ;(vuefire.useFirestore as any).mockReturnValue({})

        // Mock collection to return its name for easier identification in query assertions
        ;(firestore.collection as any).mockImplementation((db: any, name: string) => name)

        // Mock where to return a structured object we can inspect
        ;(firestore.where as any).mockImplementation((field: string, op: string, val: any) => ({ field, op, val }))

        // Mock getDoc to return empty snapshot by default
        ;(firestore.getDoc as any).mockResolvedValue({
            exists: () => false,
            data: () => null
        })

        // Mock getDocs to return empty snapshot
        ;(firestore.getDocs as any).mockResolvedValue({
            empty: true,
            docs: []
        })
    })

    it('should fetch tasks with optimized query (status=focus and focusDate=today)', async () => {
        const { fetchDaily, todayStr } = useDaily()

        await fetchDaily()

        // Verify that query was called for 'tasks' collection with the correct filters
        expect(firestore.query).toHaveBeenCalledWith(
            'tasks',
            expect.objectContaining({ field: 'userId', op: '==', val: 'test-user' }),
            expect.objectContaining({ field: 'status', op: '==', val: 'focus' }),
            expect.objectContaining({ field: 'focusDate', op: '==', val: todayStr.value })
        )
    })

    it('should NOT fetch all tasks (unoptimized query)', async () => {
        const { fetchDaily } = useDaily()
        await fetchDaily()

        const calls = (firestore.query as any).mock.calls
        const unoptimizedCall = calls.find((args: any[]) =>
            args[0] === 'tasks' &&
            args.length === 2 && // collection + 1 where clause
            args[1].field === 'userId'
        )
        expect(unoptimizedCall).toBeUndefined()
    })
})
