import { defineStore } from 'pinia'
import { collection, addDoc, deleteDoc, doc, query, where, serverTimestamp, orderBy } from 'firebase/firestore'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import type { Transaction } from '~/types'
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
            ? `users/${user.value.uid}/transactions`
            : `companies/${tenantId.value}/transactions`
    })

    // Transactions
    const transactionsQuery = computed(() => {
        if (!user.value) return null
        const coll = collection(db, collectionPath.value)

        // If personal, we naturally only see our own doc path, but userId check is fine too
        // If company, we might want to see all? Or just ours?
        // Let's assume company view shows everything for now.
        return query(coll, orderBy('date', 'desc'))
    })
    const transactions = useCollection<Transaction>(transactionsQuery)

    // Computed
    const monthlyStats = computed(() => {
        if (!transactions.value) return { revenue: 0, expenses: 0, burn: 0 }

        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        return transactions.value.reduce((acc, t) => {
            const tDate = new Date(t.date)
            if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
                if (t.type === 'income') acc.revenue += t.amount
                if (t.type === 'expense') acc.expenses += t.amount
            }
            return acc
        }, { revenue: 0, expenses: 0, burn: 0 })
    })

    // Actions
    const addTransaction = async (data: Omit<Transaction, 'id' | 'userId'>) => {
        if (!user.value) return
        await addDoc(collection(db, collectionPath.value), {
            ...data,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const deleteTransaction = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, collectionPath.value, id))
    }

    return {
        scope,
        collectionPath,
        transactions,
        monthlyStats,
        addTransaction,
        deleteTransaction
    }
})
