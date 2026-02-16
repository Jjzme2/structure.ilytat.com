import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// Mock useState via Nuxt Utils
const stateMap = new Map()
mockNuxtImport('useState', () => (key: string, init: () => any) => {
    if (!stateMap.has(key)) {
        stateMap.set(key, ref(init ? init() : undefined))
    }
    return stateMap.get(key)
})

// Hoist vuefire mock
const { mockUseCurrentUser, userRef } = vi.hoisted(() => {
    const mock = vi.fn()
    return { mockUseCurrentUser: mock, userRef: {} }
})

vi.mock('vuefire', () => ({
    useCurrentUser: mockUseCurrentUser
}))

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Import composable
import { useR2 } from '../../client/composables/useR2'

describe('useR2 Composable', () => {
    let currentUserRef: any

    beforeEach(() => {
        vi.clearAllMocks()
        stateMap.clear()
        mockFetch.mockReset()

        currentUserRef = ref({ uid: 'test-user', getIdToken: async () => 'mock-token' })
        mockUseCurrentUser.mockReturnValue(currentUserRef)
    })

    it('should fetch documents and update state', async () => {
        const mockDocs = [{ key: 'doc1', size: 100, lastModified: '2023-01-01' }]
        mockFetch.mockResolvedValue(mockDocs)

        const { fetchDocuments, documents } = useR2()

        await fetchDocuments()

        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(documents.value).toHaveLength(1)
        expect(documents.value[0].key).toBe('doc1')
    })

    it('should share state between instances', async () => {
        const mockDocs = [{ key: 'doc1', size: 100, lastModified: '2023-01-01' }]
        mockFetch.mockResolvedValue(mockDocs)

        const instance1 = useR2()
        const instance2 = useR2()

        await instance1.fetchDocuments()

        expect(instance1.documents.value).toHaveLength(1)
        expect(instance2.documents.value).toHaveLength(1)
        expect(instance1.documents).toBe(instance2.documents)
    })

    it('should cache results and not re-fetch if data exists for same user', async () => {
        const mockDocs = [{ key: 'doc1', size: 100, lastModified: '2023-01-01' }]
        mockFetch.mockResolvedValue(mockDocs)

        const { fetchDocuments } = useR2()

        // First fetch
        await fetchDocuments()
        expect(mockFetch).toHaveBeenCalledTimes(1)

        // Second fetch (should use cache)
        await fetchDocuments()
        expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should cache empty results as well', async () => {
        const mockDocs: any[] = []
        mockFetch.mockResolvedValue(mockDocs)

        const { fetchDocuments } = useR2()

        // First fetch (returns empty)
        await fetchDocuments()
        expect(mockFetch).toHaveBeenCalledTimes(1)

        // Second fetch (should use cache even if empty)
        await fetchDocuments()
        expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should force re-fetch if force=true', async () => {
        const mockDocs = [{ key: 'doc1', size: 100, lastModified: '2023-01-01' }]
        mockFetch.mockResolvedValue(mockDocs)

        const { fetchDocuments } = useR2()

        // First fetch
        await fetchDocuments()
        expect(mockFetch).toHaveBeenCalledTimes(1)

        // Force fetch
        await fetchDocuments(true)
        expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should re-fetch if user changes', async () => {
        const mockDocsA = [{ key: 'docA', size: 100, lastModified: '2023-01-01' }]
        const mockDocsB = [{ key: 'docB', size: 100, lastModified: '2023-01-01' }]

        mockFetch
            .mockResolvedValueOnce(mockDocsA)
            .mockResolvedValueOnce(mockDocsB)

        const { fetchDocuments, documents } = useR2()

        // User A fetch
        await fetchDocuments()
        expect(documents.value[0].key).toBe('docA')
        expect(mockFetch).toHaveBeenCalledTimes(1)

        // Switch user
        currentUserRef.value = { uid: 'other-user', getIdToken: async () => 'mock-token-2' }

        await fetchDocuments()

        expect(documents.value[0].key).toBe('docB')
        expect(mockFetch).toHaveBeenCalledTimes(2)
    })
})
