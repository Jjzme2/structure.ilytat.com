import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import type { OKR } from '~/types'
import { useTenant } from '~/composables/useTenant'

export const useStrategyStore = defineStore('strategy', () => {
    const user = useCurrentUser()
    const db = useFirestore()

    const scope = useTenant().scope
    const tenantId = useTenant().tenantId

    // Helper to get the correct collection path
    const collectionPath = computed(() => {
        if (!user.value) return 'okrs' // Fallback
        return scope.value === 'personal'
            ? `users/${user.value.uid}/okrs`
            : `companies/${tenantId.value}/okrs`
    })

    // OKRs
    const okrsQuery = computed(() => {
        if (!user.value) return null
        const coll = collection(db, collectionPath.value)
        return query(coll)
    })
    const okrs = useCollection<OKR>(okrsQuery)

    // Actions
    const addOKR = async (data: Omit<OKR, 'id' | 'userId'>) => {
        if (!user.value) return
        await addDoc(collection(db, collectionPath.value), {
            ...data,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const updateOKRStatus = async (id: string, status: OKR['status']) => {
        if (!user.value) return
        await updateDoc(doc(db, collectionPath.value, id), { status })
    }

    const deleteOKR = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, collectionPath.value, id))
    }

    const updateKeyResult = async (okrId: string, krId: string, current: number) => {
        if (!user.value || !okrs.value) return
        const okr = okrs.value.find(o => o.id === okrId)
        if (!okr) return

        const updatedKRs = okr.keyResults.map(kr =>
            kr.id === krId ? { ...kr, current } : kr
        )

        await updateDoc(doc(db, collectionPath.value, okrId), { keyResults: updatedKRs })
    }

    return {
        scope,
        collectionPath,
        okrs,
        addOKR,
        updateOKRStatus,
        deleteOKR,
        updateKeyResult
    }
})
