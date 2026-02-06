<template>
    <div class="min-h-screen space-y-12 pb-20 animate-fade-in">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="space-y-1">
                <h1
                    class="text-4xl lg:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-amber-400 via-orange-500 to-red-600">
                    Strategy
                </h1>
                <p class="text-slate-500 font-medium tracking-wide">Objectives & Key Results</p>
            </div>

            <button @click="showOKRForm = true"
                class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-500 font-bold hover:bg-amber-900/20 transition-all shadow-lg hover:shadow-amber-500/10">
                + Set Objective
            </button>
        </div>

        <!-- Strategy Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Daily 6 Tactical Widget -->
            <div class="lg:col-span-1 space-y-4">
                <div class="bg-glass border border-glass rounded-[2rem] p-6 relative overflow-hidden group">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>

                    <div class="relative z-10">
                        <h2 class="text-xl font-bold text-amber-400 mb-1 flex items-center gap-2">
                            <span>🛡️</span> Daily Tactics
                        </h2>
                        <p class="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold">Priority Protocol</p>

                        <div class="space-y-3">
                            <div v-for="i in 6" :key="i"
                                class="min-h-[3rem] rounded-xl border-dashed border-2 flex items-center px-4 transition-all"
                                :class="getSlot(i) ? 'bg-slate-800/50 border-amber-500/30 text-slate-200' : 'border-slate-800 text-slate-600'">
                                <span class="mr-3 font-mono font-bold text-amber-600 opacity-50">{{ i }}.</span>
                                <span v-if="getSlot(i)" class="font-medium truncate">{{ getSlot(i)?.title }}</span>
                                <span v-else class="text-xs italic">Open Slot</span>

                                <button v-if="getSlot(i)" @click="removeFromFocus(getSlot(i)!.id)"
                                    class="ml-auto text-slate-600 hover:text-amber-500">×</button>
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t border-slate-800">
                            <p class="text-xs text-center text-slate-500 mb-3">Assign from active tasks</p>
                            <div class="flex gap-2 justify-center">
                                <NuxtLink to="/tasks?view=list"
                                    class="px-4 py-2 rounded-lg bg-slate-800 text-xs font-bold text-slate-400 hover:bg-slate-700 transition">
                                    Select from Backlog
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- OKR Dashboard -->
            <div class="lg:col-span-2 space-y-6">
                <div v-if="okrs.length === 0" class="text-center py-20 bg-glass border border-glass rounded-[2rem]">
                    <div class="text-4xl mb-4 grayscale opacity-30">🎯</div>
                    <h3 class="text-xl font-bold text-slate-500">No Objectives Set</h3>
                    <p class="text-slate-600 mb-6">Define your quarterly goals to track high-level progress.</p>
                </div>

                <div v-for="okr in okrs" :key="okr.id"
                    class="bg-glass border border-glass rounded-3xl p-8 relative group hover:border-amber-500/20 transition-all">
                    <div class="flex items-start justify-between mb-6">
                        <div>
                            <div class="flex items-center gap-3 mb-2">
                                <span
                                    class="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Q{{ okr.quarter }} {{ okr.year }}
                                </span>
                                <span class="w-2 h-2 rounded-full" :class="getStatusColor(okr.status)"></span>
                            </div>
                            <h3 class="text-2xl font-bold text-slate-200">{{ okr.objective }}</h3>
                        </div>
                        <button @click="deleteOKR(okr.id)" class="text-slate-600 hover:text-rose-500 transition">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <!-- Key Results -->
                    <div class="space-y-6">
                        <div v-for="kr in okr.keyResults" :key="kr.id" class="space-y-3">
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-200 font-bold">{{ kr.description }}</span>
                                <div class="flex items-center gap-3">
                                    <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                                        {{ getTasksForKR(okr.id, kr.id).filter(t => t.status === 'done').length }} / {{ getTasksForKR(okr.id, kr.id).length }} Tasks
                                    </span>
                                    <span class="font-mono font-bold text-amber-400">{{ kr.current }} / {{ kr.target }} {{
                                        kr.unit }}</span>
                                </div>
                            </div>
                            <!-- Progress Bar -->
                            <div class="h-2 bg-slate-800 rounded-full overflow-hidden relative group/bar cursor-pointer"
                                @click="promptUpdateKR(okr.id, kr)">
                                <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-orange-500 transition-all duration-1000"
                                    :style="{ width: `${(kr.current / kr.target) * 100}%` }"></div>
                                <div
                                    class="absolute inset-0 bg-white/5 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                </div>
                            </div>

                            <!-- Associated Tasks -->
                            <div v-if="getTasksForKR(okr.id, kr.id).length > 0" class="pl-4 space-y-1.5 border-l border-slate-800">
                                <div v-for="task in getTasksForKR(okr.id, kr.id)" :key="task.id" 
                                    class="flex items-center gap-2 text-[11px] group/task">
                                    <div class="w-1.5 h-1.5 rounded-full" 
                                        :class="task.status === 'done' ? 'bg-emerald-500' : 'bg-slate-700'"></div>
                                    <span :class="task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-400'">
                                        {{ task.title }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add OKR Modal -->
        <Transition name="fade">
            <div v-if="showOKRForm"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                    <h3 class="text-xl font-bold text-white mb-4">Define Objective</h3>
                    <form @submit.prevent="submitOKR" class="space-y-4">
                        <input v-model="okrForm.objective" placeholder="What do you want to achieve?"
                            class="w-full bg-slate-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                            required />

                        <div class="flex gap-4">
                            <input v-model.number="okrForm.quarter" type="number" min="1" max="4"
                                class="w-20 bg-slate-800 rounded-xl p-3 text-center text-white" />
                            <input v-model.number="okrForm.year" type="number"
                                class="w-24 bg-slate-800 rounded-xl p-3 text-center text-white" />
                        </div>

                        <div class="border-t border-slate-800 pt-4">
                            <p class="text-sm text-slate-500 mb-2 font-bold">Key Result (Start with 1)</p>
                            <div class="grid grid-cols-3 gap-2">
                                <input v-model="okrForm.krDesc" placeholder="Metric (e.g. Sales)"
                                    class="col-span-3 bg-slate-800 rounded-xl p-3 text-sm text-white" required />
                                <input v-model.number="okrForm.krTarget" type="number" placeholder="Target"
                                    class="bg-slate-800 rounded-xl p-3 text-sm text-white" required />
                                <input v-model="okrForm.krUnit" placeholder="Unit (e.g. $)"
                                    class="col-span-2 bg-slate-800 rounded-xl p-3 text-sm text-white" required />
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 pt-4">
                            <button type="button" @click="showOKRForm = false"
                                class="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                            <button type="submit"
                                class="px-6 py-2 bg-amber-600 rounded-xl text-white font-bold hover:bg-amber-500">Launch</button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useStrategyStore } from '~/stores/strategy'
import { useTasksStore } from '~/stores/tasks'
import { v4 as uuidv4 } from 'uuid' // Assuming ability to generate IDs or just use simple random for demo if uuid not avail
import { collection, query, where } from 'firebase/firestore'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import type { Task, OKR } from '~/types'

const store = useStrategyStore()
const tasksStore = useTasksStore()
const user = useCurrentUser()
const db = useFirestore()

const showOKRForm = ref(false)
const okrForm = reactive({
    objective: '',
    quarter: 1,
    year: 2026,
    krDesc: '',
    krTarget: 100,
    krUnit: '%'
})

const tasksQuery = computed(() => {
    if (!user.value) return null
    return query(collection(db, 'tasks'), where('userId', '==', user.value.uid))
})
const tasks = useCollection<Task>(tasksQuery)

const okrs = store.okrs || [] // Safe access

// Daily 6 Logic
const todayISO = new Date().toISOString().split('T')[0]
const dailyFocusTasks = computed(() =>
    tasks.value?.filter(t => t.status === 'focus' && t.focusDate === todayISO)
        .sort((a, b) => (a.focusOrder || 0) - (b.focusOrder || 0)) || []
)

const getTasksForKR = (okrId: string, krId: string) => {
    return tasks.value?.filter(t => t.okrId === okrId && t.krId === krId) || []
}

const getSlot = (index: number) => {
    return dailyFocusTasks.value.find(t => t.focusOrder === index)
}

const removeFromFocus = (id: string) => {
    // Assuming tasksStore has this method exposed, otherwise imported
    tasksStore.removeFromFocus(id)
}

const submitOKR = async () => {
    const krId = Math.random().toString(36).substr(2, 9)
    await store.addOKR({
        objective: okrForm.objective,
        quarter: okrForm.quarter,
        year: okrForm.year,
        status: 'active',
        keyResults: [{
            id: krId,
            description: okrForm.krDesc,
            target: okrForm.krTarget,
            current: 0,
            unit: okrForm.krUnit,
            status: 'pending'
        }]
    })
    showOKRForm.value = false
    okrForm.objective = ''
    okrForm.krDesc = ''
}

const deleteOKR = async (id: string) => {
    if (confirm('Archive this objective?')) {
        await store.deleteOKR(id)
    }
}

const promptUpdateKR = async (okrId: string, kr: any) => {
    const newVal = prompt(`Update progress for "${kr.description}" (${kr.unit}):`, kr.current.toString())
    if (newVal !== null) {
        const num = parseFloat(newVal)
        if (!isNaN(num)) {
            await store.updateKeyResult(okrId, kr.id, num)
        }
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
        case 'at-risk': return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
        case 'completed': return 'bg-blue-500'
        default: return 'bg-slate-500'
    }
}
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
