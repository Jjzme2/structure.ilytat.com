<template>
    <div class="min-h-screen space-y-12 pb-20 animate-fade-in">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="space-y-1">
                <h1
                    class="text-4xl lg:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
                    Inventory
                </h1>
                <p class="text-slate-500 font-medium tracking-wide">Assets & Subscriptions</p>
            </div>

            <div class="flex gap-3">
                <button @click="showSubForm = true; showAssetForm = false"
                    class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold hover:bg-emerald-900/20 transition-all">
                    + Subscription
                </button>
                <button @click="showAssetForm = true; showSubForm = false"
                    class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-teal-400 font-bold hover:bg-teal-900/20 transition-all">
                    + Asset
                </button>
            </div>
        </div>

        <!-- Forms -->
        <Transition name="slide-up">
            <div v-if="showSubForm" class="bg-glass border border-glass p-6 rounded-2xl relative">
                <div class="absolute top-4 right-4">
                    <button @click="showSubForm = false" class="text-slate-500 hover:text-white">✕</button>
                </div>
                <h3 class="text-lg font-bold text-emerald-400 mb-4">Add Subscription</h3>
                <form @submit.prevent="submitSub" class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        class="md:col-span-2 w-full py-3 rounded-xl bg-gradient-to-r text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all from-emerald-500 to-teal-600">Track
                        Expense</button>
                </form>
            </div>
        </Transition>

        <Transition name="slide-up">
            <div v-if="showAssetForm" class="bg-glass border border-glass p-6 rounded-2xl relative">
                <div class="absolute top-4 right-4">
                    <button @click="showAssetForm = false" class="text-slate-500 hover:text-white">✕</button>
                </div>
                <h3 class="text-lg font-bold text-teal-400 mb-4">Register Asset</h3>
                <form @submit.prevent="submitAsset" class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        class="md:col-span-2 w-full rounded-xl bg-slate-800 border-slate-700 text-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 px-4 py-3 outline-none transition-all" />
                    <button type="submit"
                        class="md:col-span-2 w-full py-3 rounded-xl bg-gradient-to-r text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all from-teal-500 to-cyan-600">Register</button>
                </form>
            </div>
        </Transition>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
                <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Monthly Burn</div>
                <div class="text-3xl font-black text-white flex items-baseline gap-1">
                    ${{ store.monthlyBurnRate.toFixed(2) }}
                    <span class="text-sm font-normal text-slate-500">/mo</span>
                </div>
            </div>
            <div class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
                <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Active Subs</div>
                <div class="text-3xl font-black text-white">{{ store.subscriptions?.length || 0 }}</div>
            </div>
            <div class="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
                <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Assets</div>
                <div class="text-3xl font-black text-white">{{ store.assets?.length || 0 }}</div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Subscriptions List -->
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-emerald-300 flex items-center gap-2">
                    <span>💳</span> Recurring Expenses
                </h2>
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

            <!-- Asset Inventory -->
            <div class="space-y-4">
                <h2 class="text-xl font-bold text-teal-300 flex items-center gap-2">
                    <span>📦</span> Inventory
                </h2>
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
    </div>
</template>

<script setup lang="ts">
import { useSupplyStore } from '~/stores/supply'
import type { Subscription, Asset } from '~/types'

const store = useSupplyStore()
const showSubForm = ref(false)
const showAssetForm = ref(false)

const subForm = reactive({
    name: '',
    cost: 0,
    frequency: 'monthly' as 'monthly' | 'yearly',
    renewalDate: ''
})

const assetForm = reactive({
    name: '',
    type: 'domain' as Asset['type'],
    details: ''
})

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
.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
