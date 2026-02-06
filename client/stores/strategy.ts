import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import type { OKR } from '~/types'

export const useStrategyStore = defineStore('strategy', () => {
    const user = useCurrentUser()
    const db = useFirestore()

    // OKRs
    const okrsQuery = computed(() => {
        if (!user.value) return null
        return query(collection(db, 'okrs'), where('userId', '==', user.value.uid))
    })
    const okrs = useCollection<OKR>(okrsQuery)

    // Actions
    const addOKR = async (data: Omit<OKR, 'id' | 'userId'>) => {
        if (!user.value) return
        await addDoc(collection(db, 'okrs'), {
            ...data,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const updateOKRStatus = async (id: string, status: OKR['status']) => {
        if (!user.value) return
        await updateDoc(doc(db, 'okrs', id), { status })
    }

    const deleteOKR = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, 'okrs', id))
    }

    const updateKeyResult = async (okrId: string, krId: string, current: number) => {
        if (!user.value || !okrs.value) return
        const okr = okrs.value.find(o => o.id === okrId)
        if (!okr) return

        const updatedKRs = okr.keyResults.map(kr =>
            kr.id === krId ? { ...kr, current } : kr
        )

        await updateDoc(doc(db, 'okrs', okrId), { keyResults: updatedKRs })
    }

    return {
        okrs,
        addOKR,
        updateOKRStatus,
        deleteOKR,
        updateKeyResult
    }
})
