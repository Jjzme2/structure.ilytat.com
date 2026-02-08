import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import type { Briefing } from '~/types'
import { useTenant } from '~/composables/useTenant'

export const useBriefingsStore = defineStore('briefings', () => {
    const user = useCurrentUser()
    const db = useFirestore()
    const { scope, tenantId } = useTenant()

    // Helper to get the correct collection path
    const collectionPath = computed(() => {
        if (!user.value) return 'briefings' // Fallback
        return scope.value === 'personal'
            ? `users/${user.value.uid}/briefings`
            : `companies/${tenantId.value}/briefings`
    })

    // Briefings Query
    const briefingsQuery = computed(() => {
        if (!user.value) return null
        const coll = collection(db, collectionPath.value)
        return query(coll, orderBy('date', 'desc'))
    })

    const briefings = useCollection<Briefing>(briefingsQuery)

    // Actions
    const addBriefing = async (data: Omit<Briefing, 'id' | 'createdAt' | 'tenantId' | 'userId'>) => {
        if (!user.value) return

        await addDoc(collection(db, collectionPath.value), {
            ...data,
            tenantId: scope.value === 'company' ? tenantId.value : null,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const updateBriefing = async (id: string, data: Partial<Briefing>) => {
        if (!user.value) return
        const docRef = doc(db, collectionPath.value, id)
        // ensure we don't overwrite crucial fields unless intended
        const { id: _id, createdAt, ...updateData } = data
        await updateDoc(docRef, updateData)
    }

    const deleteBriefing = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, collectionPath.value, id))
    }

    return {
        briefings,
        addBriefing,
        updateBriefing,
        deleteBriefing
    }
})
