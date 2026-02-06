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
    const getNotesCollection = () => {
        if (!user.value) return null
        return collection(db, 'notes')
    }

    const addNote = async (title: string, content: string) => {
        if (!user.value) return
        await addDoc(collection(db, 'notes'), {
            title,
            content,
            userId: user.value.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
    }

    const updateNote = async (id: string, data: Partial<Note>) => {
        if (!user.value) return
        const docRef = doc(db, 'notes', id)
        await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
    }

    const deleteNote = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, 'notes', id))
    }

    return {
        addNote,
        updateNote,
        deleteNote
    }
})
