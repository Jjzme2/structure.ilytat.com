import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'
import type { Quote } from '~/types'

export const useQuotesStore = defineStore('quotes', () => {
    const user = useCurrentUser()
    const db = useFirestore()

    const addQuote = async (text: string, author: string) => {
        if (!user.value) return
        await addDoc(collection(db, 'quotes'), {
            text,
            author,
            userId: user.value.uid
        })
    }

    const updateQuote = async (id: string, data: Partial<Quote>) => {
        if (!user.value) return
        const docRef = doc(db, 'quotes', id)
        await updateDoc(docRef, data)
    }

    const deleteQuote = async (id: string) => {
        if (!user.value) return
        const docRef = doc(db, 'quotes', id)
        await deleteDoc(docRef)
    }

    return {
        addQuote,
        updateQuote,
        deleteQuote
    }
})
