import { useCurrentUser } from 'vuefire'

export interface R2File {
    key: string
    size: number
    lastModified: string
    filename: string // synthesized from key usually
}

export const useR2 = () => {
    const user = useCurrentUser()

    // Shared state for caching and cross-component updates
    const documents = useState<R2File[]>('r2-documents', () => [])
    const loadingDocs = useState<boolean>('r2-loading-docs', () => false)
    const fetchedUserId = useState<string | null>('r2-fetched-user-id', () => null)

    // Local state for specific actions
    const uploading = ref(false)
    const error = ref<string | null>(null)

    const fetchDocuments = async (force = false) => {
        if (!user.value) return

        // Optimized: Check cache before fetching
        if (!force && fetchedUserId.value === user.value.uid) {
            return
        }

        loadingDocs.value = true
        error.value = null
        try {
            const token = await user.value.getIdToken()
            const data = await $fetch<any[]>('/api/documents/list', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            documents.value = data.map(item => ({
                ...item,
                filename: item.key.replace(/^documents\/(?:users\/[^\/]+\/)?\d+-/, '') // Cleanup timestamp prefix for display
            }))
            fetchedUserId.value = user.value.uid
        } catch (e: any) {
            console.error('Failed to fetch documents', e)
            error.value = e.message
        } finally {
            loadingDocs.value = false
        }
    }

    const uploadDocument = async (file: File) => {
        if (!user.value) return
        uploading.value = true
        error.value = null

        const formData = new FormData()
        formData.append('file', file)

        try {
            const token = await user.value.getIdToken()
            await $fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            await fetchDocuments(true) // Force refresh list to update UI immediately
        } catch (e: any) {
            console.error('Upload failed', e)
            error.value = e.message
        } finally {
            uploading.value = false
        }
    }

    const getDownloadUrl = async (key: string) => {
        if (!user.value) return ''
        const token = await user.value.getIdToken()
        return `/api/documents/download?key=${encodeURIComponent(key)}&token=${token}`
    }

    const getPreviewUrl = async (key: string) => {
        if (!user.value) return ''
        const token = await user.value.getIdToken()
        return `/api/documents/download?key=${encodeURIComponent(key)}&inline=true&token=${token}`
    }

    return {
        documents,
        uploading,
        loadingDocs,
        error,
        uploadDocument,
        fetchDocuments,
        getDownloadUrl,
        getPreviewUrl
    }
}
