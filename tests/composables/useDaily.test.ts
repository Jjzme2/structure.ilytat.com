import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDaily } from '../../client/composables/useDaily'
import { ref, computed } from 'vue'
import { getDoc, getDocs, collection, query, where, limit } from 'firebase/firestore'

// Mock dependencies
vi.mock('vuefire', () => ({
    useCurrentUser: () => ref({ uid: 'test-user-id' }),
    useFirestore: () => ({})
}))

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn()
}))

// Mock Nuxt auto-imports
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('reactive', (obj: any) => obj)

describe('useDaily', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('fetches daily data efficiently including tasks', async () => {
        // Setup mocks
        // dailyRef
        (getDoc as any).mockImplementation((ref: any) => {
            return Promise.resolve({
                exists: () => false, // No daily quote yet
                data: () => ({})
            })
        });

        // tasksQuery, datesQuery
        (getDocs as any).mockImplementation((q: any) => {
            return Promise.resolve({
                empty: true,
                docs: []
            })
        });

        const { fetchDaily, dailySnapshot } = useDaily()

        await fetchDaily()

        // Assert that getDocs was called for tasks
        // We expect collection 'tasks' to be queried
        expect(collection).toHaveBeenCalledWith(expect.anything(), 'tasks')

        // Verify parallel execution: getDocs should be called
        // In this test scenario: dates + tasks + userQuotes + systemQuotes = 4
        expect(getDocs).toHaveBeenCalledTimes(4)
    })
})
