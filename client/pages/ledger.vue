<template>
    <div class="min-h-screen space-y-12 pb-20 animate-fade-in">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="space-y-1">
                <h1
                    class="text-4xl lg:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600">
                    Finance
                </h1>
                <p class="text-slate-500 font-medium tracking-wide">Financial Overview</p>
            </div>

            <button @click="showForm = true"
                class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 transition-all shadow-lg">
                + Transaction
            </button>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
                class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 group hover:border-emerald-500/20 transition-all">
                <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Revenue (MTD)
                </div>
                <div class="text-3xl font-black text-white">${{ store.monthlyStats.revenue.toFixed(2) }}</div>
            </div>
            <div
                class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 group hover:border-rose-500/20 transition-all">
                <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    Expenses (MTD)
                </div>
                <div class="text-3xl font-black text-white">${{ store.monthlyStats.expenses.toFixed(2) }}</div>
            </div>
            <div
                class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 group hover:border-blue-500/20 transition-all">
                <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                    Net Flow
                </div>
                <div class="text-3xl font-black" :class="netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                    {{ netFlow >= 0 ? '+' : '' }}${{ netFlow.toFixed(2) }}
                </div>
            </div>
        </div>

        <!-- Balance Bar -->
        <div class="bg-slate-900/30 rounded-full h-4 w-full overflow-hidden flex relative">
            <!-- Revenue Bar -->
            <div class="h-full bg-emerald-500 transition-all duration-1000"
                :style="{ width: `${balance.revenuePercent}%` }"></div>
            <!-- Expense Bar -->
            <div class="h-full bg-rose-500 transition-all duration-1000"
                :style="{ width: `${balance.expensePercent}%` }"></div>
        </div>

        <!-- Transaction List -->
        <div class="space-y-6">
            <h2 class="text-xl font-bold text-slate-400 flex items-center gap-2">
                <span>📋</span> Recent Activity
            </h2>

            <div v-if="sortedTransactions.length" class="space-y-2">
                <div v-for="t in sortedTransactions" :key="t.id"
                    class="p-4 rounded-xl bg-glass border border-glass flex items-center justify-between group hover:border-slate-700 transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                            :class="t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'">
                            {{ t.type === 'income' ? '↗' : '↘' }}
                        </div>
                        <div>
                            <div class="font-bold text-slate-200">{{ t.description }}</div>
                            <div class="text-xs text-slate-500 capitalize">{{ t.category }} • {{ formatDate(t.date) }}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="font-mono font-bold"
                            :class="t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'">
                            {{ t.type === 'income' ? '+' : '-' }}${{ t.amount.toFixed(2) }}
                        </span>
                        <button @click="store.deleteTransaction(t.id)"
                            class="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-500 transition-all">×</button>
                    </div>
                </div>
            </div>
            <div v-else class="text-center py-12 text-slate-600 italic">
                No financial records found. Start by adding a transaction.
            </div>
        </div>

        <!-- Add Transaction Form -->
        <Transition name="fade">
            <div v-if="showForm"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                    <h3 class="text-xl font-bold text-white mb-4">Log Transaction</h3>
                    <form @submit.prevent="submitTransaction" class="space-y-4">
                        <div class="flex bg-slate-800 rounded-xl p-1">
                            <button type="button" @click="form.type = 'expense'"
                                class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                                :class="form.type === 'expense' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'">Expense</button>
                            <button type="button" @click="form.type = 'income'"
                                class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                                :class="form.type === 'income' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'">Income</button>
                        </div>

                        <input v-model="form.description" placeholder="Description"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                            required />
                        <input v-model.number="form.amount" type="number" step="0.01" placeholder="Amount"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                            required />
                        <input v-model="form.category" placeholder="Category (e.g. Hosting)"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                            required />
                        <input v-model="form.date" type="date"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                            required />

                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="showForm = false"
                                class="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                            <button type="submit"
                                class="px-6 py-2 bg-slate-700 rounded-xl text-white font-bold hover:bg-slate-600">Record</button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import type { Transaction } from '~/types'

const store = useFinanceStore()
const showForm = ref(false)

const form = reactive({
    description: '',
    amount: null as number | null,
    type: 'expense' as 'income' | 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0] as string
})

const sortedTransactions = computed(() => {
    if (!store.transactions) return []
    return [...store.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const netFlow = computed(() => store.monthlyStats.revenue - store.monthlyStats.expenses)

const balance = computed(() => {
    const total = store.monthlyStats.revenue + store.monthlyStats.expenses
    if (total === 0) return { revenuePercent: 0, expensePercent: 0 }
    return {
        revenuePercent: (store.monthlyStats.revenue / total) * 100,
        expensePercent: (store.monthlyStats.expenses / total) * 100
    }
})

const submitTransaction = async () => {
    if (!form.amount) return
    await store.addTransaction({
        description: form.description,
        amount: form.amount,
        type: form.type,
        category: form.category,
        date: form.date
    })
    showForm.value = false
    form.description = ''
    form.amount = null
    form.category = ''
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(15px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
