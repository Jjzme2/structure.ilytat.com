import { defineStore } from 'pinia'
import { collection, addDoc, deleteDoc, updateDoc, doc, query, where, serverTimestamp, orderBy } from 'firebase/firestore'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import type { Transaction, Subscription, Asset } from '~/types'
import { useTenant } from '~/composables/useTenant'

export const useFinanceStore = defineStore('finance', () => {
    const user = useCurrentUser()
    const db = useFirestore()

    const scope = useTenant().scope
    const tenantId = useTenant().tenantId

    // Helper to get the correct collection path
    const collectionPath = computed(() => {
        if (!user.value) return 'transactions' // Fallback
        return scope.value === 'personal'
            ? `users/${user.value.uid}`
            : `companies/${tenantId.value}`
    })

    // Transactions
    const transactionsQuery = computed(() => {
        if (!user.value) return null
        const coll = collection(db, `${collectionPath.value}/transactions`)
        return query(coll, orderBy('date', 'desc'))
    })
    const transactions = useCollection<Transaction>(transactionsQuery)

    // Subscriptions
    const subscriptionsQuery = computed(() => {
        if (!user.value) return null
        const coll = collection(db, `${collectionPath.value}/subscriptions`)
        return query(coll, orderBy('cost', 'desc'))
    })
    const subscriptions = useCollection<Subscription>(subscriptionsQuery)

    // Assets
    const assetsQuery = computed(() => {
        if (!user.value) return null
        const coll = collection(db, `${collectionPath.value}/assets`)
        return query(coll, orderBy('name', 'asc'))
    })
    const assets = useCollection<Asset>(assetsQuery)

    // Computed
    const monthlyStats = computed(() => {
        const stats = { revenue: 0, expenses: 0, burn: 0 }

        // Calculate Burn Rate from Subscriptions
        if (subscriptions.value) {
            stats.burn = subscriptions.value.reduce((total, sub) => {
                if (sub.frequency === 'monthly') return total + sub.cost
                if (sub.frequency === 'yearly') return total + (sub.cost / 12)
                return total
            }, 0)
        }

        if (!transactions.value) return stats

        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        transactions.value.reduce((acc, t) => {
            const tDate = new Date(t.date)
            if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
                if (t.type === 'income') acc.revenue += t.amount
                if (t.type === 'expense') acc.expenses += t.amount
            }
            return acc
        }, stats)

        return stats
    })

    // Actions - Transactions
    const addTransaction = async (data: Omit<Transaction, 'id' | 'userId'>) => {
        if (!user.value) return
        await addDoc(collection(db, `${collectionPath.value}/transactions`), {
            ...data,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const deleteTransaction = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, `${collectionPath.value}/transactions`, id))
    }

    // Actions - Subscriptions
    const addSubscription = async (data: Omit<Subscription, 'id' | 'userId'>) => {
        if (!user.value) return
        await addDoc(collection(db, `${collectionPath.value}/subscriptions`), {
            ...data,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const deleteSubscription = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, `${collectionPath.value}/subscriptions`, id))
    }

    // Actions - Assets
    const addAsset = async (data: Omit<Asset, 'id' | 'userId'>) => {
        if (!user.value) return
        await addDoc(collection(db, `${collectionPath.value}/assets`), {
            ...data,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const updateAssetStatus = async (id: string, status: Asset['status']) => {
        if (!user.value) return
        await updateDoc(doc(db, `${collectionPath.value}/assets`, id), { status })
    }

    const deleteAsset = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, `${collectionPath.value}/assets`, id))
    }

    return {
        scope,
        collectionPath,
        transactions,
        subscriptions,
        assets,
        monthlyStats,
        addTransaction,
        deleteTransaction,
        addSubscription,
        deleteSubscription,
        addAsset,
        updateAssetStatus,
        deleteAsset
    }
})
