import { defineStore } from 'pinia'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import type { Subscription, Asset } from '~/types'

export const useSupplyStore = defineStore('supply', () => {
    const user = useCurrentUser()
    const db = useFirestore()

    // Subscriptions
    const subscriptionsQuery = computed(() => {
        if (!user.value) return null
        return query(collection(db, 'subscriptions'), where('userId', '==', user.value.uid))
    })
    const subscriptions = useCollection<Subscription>(subscriptionsQuery)

    // Assets
    const assetsQuery = computed(() => {
        if (!user.value) return null
        return query(collection(db, 'assets'), where('userId', '==', user.value.uid))
    })
    const assets = useCollection<Asset>(assetsQuery)

    // Computed
    const monthlyBurnRate = computed(() => {
        if (!subscriptions.value) return 0
        return subscriptions.value.reduce((total, sub) => {
            if (sub.frequency === 'monthly') return total + sub.cost
            if (sub.frequency === 'yearly') return total + (sub.cost / 12)
            return total
        }, 0)
    })

    // Actions - Subscriptions
    const addSubscription = async (data: Omit<Subscription, 'id' | 'userId'>) => {
        if (!user.value) return
        await addDoc(collection(db, 'subscriptions'), {
            ...data,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const deleteSubscription = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, 'subscriptions', id))
    }

    // Actions - Assets
    const addAsset = async (data: Omit<Asset, 'id' | 'userId'>) => {
        if (!user.value) return
        await addDoc(collection(db, 'assets'), {
            ...data,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const updateAssetStatus = async (id: string, status: Asset['status']) => {
        if (!user.value) return
        await updateDoc(doc(db, 'assets', id), { status })
    }

    const deleteAsset = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, 'assets', id))
    }

    return {
        subscriptions,
        assets,
        monthlyBurnRate,
        addSubscription,
        deleteSubscription,
        addAsset,
        updateAssetStatus,
        deleteAsset
    }
})
