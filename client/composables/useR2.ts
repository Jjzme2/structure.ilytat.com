import { useCurrentUser } from 'vuefire'

export interface R2File {
    key: string
    size: number
    lastModified: string
    filename: string // synthesized from key usually
}

export const useR2 = () => {
    const user = useCurrentUser()
    const uploading = ref(false)
    const loadingDocs = ref(false)
    const error = ref<string | null>(null)
    const documents = ref<R2File[]>([])

    const fetchDocuments = async () => {
        if (!user.value) return
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
                filename: item.key.replace(/^documents\/\d+-/, '') // Cleanup timestamp prefix for display
            }))
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
            await fetchDocuments() // Refresh list
        } catch (e: any) {
            console.error('Upload failed', e)
            error.value = e.message
        } finally {
            uploading.value = false
        }
    }

    const getDownloadUrl = (key: string) => {
        // We will create a proxy endpoint for this
        return `/api/documents/download?key=${encodeURIComponent(key)}`
    }

    const getPreviewUrl = (key: string) => {
        return `/api/documents/download?key=${encodeURIComponent(key)}&inline=true`
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
