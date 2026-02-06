import { defineStore } from 'pinia'
import { collection, addDoc, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import type { Transaction } from '~/types'

export const useFinanceStore = defineStore('finance', () => {
    const user = useCurrentUser()
    const db = useFirestore()

    // Transactions
    const transactionsQuery = computed(() => {
        if (!user.value) return null
        return query(collection(db, 'transactions'), where('userId', '==', user.value.uid))
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
        await addDoc(collection(db, 'transactions'), {
            ...data,
            userId: user.value.uid,
            createdAt: serverTimestamp()
        })
    }

    const deleteTransaction = async (id: string) => {
        if (!user.value) return
        await deleteDoc(doc(db, 'transactions', id))
    }

    return {
        transactions,
        monthlyStats,
        addTransaction,
        deleteTransaction
    }
})
