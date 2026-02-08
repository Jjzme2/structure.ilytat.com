<template>
    <div class="min-h-screen space-y-8 pb-20">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="space-y-1">
                <h1
                    class="text-4xl lg:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600">
                    Finance
                </h1>
                <p class="text-slate-500 font-medium tracking-wide">Cash Flow & Assets</p>
            </div>

            <div class="flex gap-2">
                <button v-if="activeTab === 'transactions'" @click="showForm = true"
                    class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 transition-all shadow-lg">
                    + Transaction
                </button>
                <div v-if="activeTab === 'recurring'" class="flex gap-2">
                    <button @click="showSubForm = true;"
                        class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold hover:bg-emerald-900/20 transition-all">
                        + Subscription
                    </button>
                </div>
                <div v-if="activeTab === 'assets'" class="flex gap-2">
                    <button @click="showAssetForm = true;"
                        class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-teal-400 font-bold hover:bg-teal-900/20 transition-all">
                        + Asset
                    </button>
                </div>
            </div>
        </div>

        <!-- KPI Cards (Global) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 group hover:border-orange-500/20 transition-all">
                <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                    Burn Rate
                </div>
                <div class="text-3xl font-black text-white">${{ store.monthlyStats.burn.toFixed(2) }}<span
                        class="text-sm font-normal text-slate-500">/mo</span></div>
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

        <!-- Navigation Tabs -->
        <div class="flex gap-4 border-b border-slate-800 pb-4 overflow-x-auto">
            <button @click="activeTab = 'transactions'"
                class="px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap"
                :class="activeTab === 'transactions' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'">
                Transactions
            </button>
            <button @click="activeTab = 'recurring'"
                class="px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap"
                :class="activeTab === 'recurring' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-emerald-400'">
                Recurring
            </button>
            <button @click="activeTab = 'assets'"
                class="px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap"
                :class="activeTab === 'assets' ? 'bg-slate-800 text-teal-400' : 'text-slate-500 hover:text-teal-400'">
                Assets
            </button>
        </div>


        <!-- Content Area -->
        <div class="min-h-[400px]">

            <!-- Transactions Tab -->
            <div v-if="activeTab === 'transactions'" class="space-y-6">
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
                                <div class="text-xs text-slate-500 capitalize">{{ t.category }} • {{ formatDate(t.date)
                                    }}
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

            <!-- Recurring Tab -->
            <div v-if="activeTab === 'recurring'" class="space-y-6">
                <div v-if="store.subscriptions?.length" class="space-y-2">
                    <div v-for="sub in store.subscriptions" :key="sub.id"
                        class="p-4 rounded-xl bg-glass border border-glass flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                        <div>
                            <div class="font-bold text-slate-200">{{ sub.name }}</div>
                            <div class="text-xs text-slate-500">Renews: {{ formatDate(sub.renewalDate) }}</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <div class="font-mono font-bold text-emerald-400">${{ sub.cost }}</div>
                                <div class="text-[10px] uppercase text-slate-600">{{ sub.frequency }}</div>
                            </div>
                            <button @click="store.deleteSubscription(sub.id)"
                                class="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity">✕</button>
                        </div>
                    </div>
                </div>
                <div v-else class="text-slate-500 text-sm italic">No active subscriptions.</div>
            </div>

            <!-- Assets Tab -->
            <div v-if="activeTab === 'assets'" class="space-y-6">
                <div v-if="store.assets?.length" class="space-y-2">
                    <div v-for="asset in store.assets" :key="asset.id"
                        class="p-4 rounded-xl bg-glass border border-glass flex items-center justify-between group hover:border-teal-500/30 transition-all">
                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl">
                                {{ getAssetIcon(asset.type) }}
                            </div>
                            <div>
                                <div class="font-bold text-slate-200">{{ asset.name }}</div>
                                <div class="text-xs text-slate-500">{{ asset.details }}</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span
                                class="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase font-bold">{{
                                    asset.type }}</span>
                            <button @click="store.deleteAsset(asset.id)"
                                class="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity">✕</button>
                        </div>
                    </div>
                </div>
                <div v-else class="text-slate-500 text-sm italic">No assets registered.</div>
            </div>

        </div>

        <!-- Modals / Forms -->

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

        <!-- Add Recurring Form -->
        <Transition name="fade">
            <div v-if="showSubForm"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                    <div class="absolute top-4 right-4">
                        <button @click="showSubForm = false" class="text-slate-500 hover:text-white">✕</button>
                    </div>
                    <h3 class="text-lg font-bold text-emerald-400 mb-4">Add Subscription</h3>
                    <form @submit.prevent="submitSub" class="space-y-4">
                        <input v-model="subForm.name" placeholder="Service Name (e.g. Netflix)"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 px-4 py-3 outline-none transition-all"
                            required />
                        <input v-model.number="subForm.cost" type="number" step="0.01" placeholder="Cost"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 px-4 py-3 outline-none transition-all"
                            required />
                        <select v-model="subForm.frequency"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 px-4 py-3 outline-none transition-all">
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <input v-model="subForm.renewalDate" type="date"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 px-4 py-3 outline-none transition-all"
                            required />
                        <button type="submit"
                            class="w-full py-3 rounded-xl bg-gradient-to-r text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all from-emerald-500 to-teal-600">Track
                            Expense</button>
                    </form>
                </div>
            </div>
        </Transition>

        <!-- Add Asset Form -->
        <Transition name="fade">
            <div v-if="showAssetForm"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                    <div class="absolute top-4 right-4">
                        <button @click="showAssetForm = false" class="text-slate-500 hover:text-white">✕</button>
                    </div>
                    <h3 class="text-lg font-bold text-teal-400 mb-4">Register Asset</h3>
                    <form @submit.prevent="submitAsset" class="space-y-4">
                        <input v-model="assetForm.name" placeholder="Asset Name"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 px-4 py-3 outline-none transition-all"
                            required />
                        <select v-model="assetForm.type"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 px-4 py-3 outline-none transition-all">
                            <option value="domain">Domain</option>
                            <option value="nfc">NFC Tag</option>
                            <option value="hardware">Hardware</option>
                            <option value="other">Other</option>
                        </select>
                        <input v-model="assetForm.details" placeholder="Details (e.g. URL, Location)"
                            class="w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 px-4 py-3 outline-none transition-all" />
                        <button type="submit"
                            class="w-full py-3 rounded-xl bg-gradient-to-r text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all from-teal-500 to-cyan-600">Register</button>
                    </form>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup lang="ts">
import { useFinanceStore } from '~/stores/finance'
import type { Transaction, Asset } from '~/types'

const store = useFinanceStore()
const showForm = ref(false)
const showSubForm = ref(false)
const showAssetForm = ref(false)
const activeTab = ref('transactions')

const form = reactive({
    description: '',
    amount: null as number | null,
    type: 'expense' as 'income' | 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0] as string
})

const subForm = reactive({
    name: '',
    cost: 0,
    frequency: 'monthly' as 'monthly' | 'yearly',
    renewalDate: new Date().toISOString().split('T')[0] as string
})

const assetForm = reactive({
    name: '',
    type: 'domain' as Asset['type'],
    details: ''
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

const submitSub = async () => {
    await store.addSubscription({ ...subForm })
    showSubForm.value = false
    subForm.name = ''
    subForm.cost = 0
}

const submitAsset = async () => {
    await store.addAsset({ ...assetForm, status: 'active' })
    showAssetForm.value = false
    assetForm.name = ''
    assetForm.details = ''
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()

const getAssetIcon = (type: string) => {
    switch (type) {
        case 'domain': return '🌐'
        case 'nfc': return '🏷️'
        case 'hardware': return '🖥️'
        default: return '📦'
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
