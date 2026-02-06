import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'
import type { ImportantDate } from '~/types'

export const useDatesStore = defineStore('dates', () => {
    const user = useCurrentUser()
    const db = useFirestore()

    const addDate = async (title: string, date: string, type: ImportantDate['type'], isPublic: boolean = false, description: string = '') => {
        if (!user.value) return
        await addDoc(collection(db, 'dates'), {
            title,
            description,
            date,
            type,
            userId: user.value.uid,
            isPublic
        })
    }

    const updateDate = async (id: string, data: Partial<ImportantDate>) => {
        console.log('Store updateDate called with:', id, data)
        if (!user.value) return
        if (!id) throw new Error('Update requires ID')
        const docRef = doc(db, 'dates', id)
        await updateDoc(docRef, data)
    }

    const deleteDate = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, 'dates', id))
    }

    return {
        addDate,
        updateDate,
        deleteDate
    }
})
