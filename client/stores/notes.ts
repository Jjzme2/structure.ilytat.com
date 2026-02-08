import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, orderBy } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'
import type { Note } from '~/types'

export const useNotesStore = defineStore('notes', () => {
    const user = useCurrentUser()
    const db = useFirestore()

    // We can't use useCollection directly here if we want reactivity based on user
    // Instead, we might want to return the query or a computed ref
    // But for simplicity in this setup, let's assume we use useCollection in components
    // OR we define actions here.

    // Actually, to satisfy the specific "Pinia" requirement effectively with Vuefire:
    const scope = useTenant().scope
    const tenantId = useTenant().tenantId

    // Helper to get the correct collection path
    const collectionPath = computed(() => {
        if (!user.value) return 'notes' // Fallback
        return scope.value === 'personal'
            ? `users/${user.value.uid}/notes`
            : `companies/${tenantId.value}/notes`
    })

    // Helper for components to get the collection ref
    const getNotesCollection = () => {
        if (!user.value) return null
        return collection(db, collectionPath.value)
    }

    const addNote = async (title: string, content: string) => {
        if (!user.value) return
        await addDoc(collection(db, collectionPath.value), {
            title,
            content,
            userId: user.value.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
    }

    const updateNote = async (id: string, data: Partial<Note>) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
    }

    const deleteNote = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, collectionPath.value, id))
    }

    return {
        scope,
        collectionPath,
        addNote,
        updateNote,
        deleteNote,
        getNotesCollection
    }
})
