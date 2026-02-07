<template>
    <div class="min-h-screen space-y-8 pb-20 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-1">
                <h1
                    class="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-600">
                    {{ viewMode === 'kanban' ? 'Daily Priorities' : 'Action Items' }}
                </h1>
                <p class="text-slate-500 font-medium tracking-wide">{{ viewMode === 'kanban' ? `${todayFormatted} •
                    Focus List` : 'Manage key deliverables' }}</p>
            </div>

            <div class="flex items-center gap-4">
                <!-- Focus Counter (Kanban mode) -->
                <div v-if="viewMode === 'kanban'"
                    class="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-900/50 to-fuchsia-900/50 border border-purple-700/50 rounded-2xl">
                    <div class="flex gap-1">
                        <div v-for="i in 6" :key="i" class="w-3 h-3 rounded-full transition-all duration-300"
                            :class="i <= focusCount ? 'bg-purple-400 shadow-lg shadow-purple-400/50' : 'bg-slate-700'">
                        </div>
                    </div>
                    <span class="text-lg font-bold text-purple-300">{{ focusCount }}/6</span>
                </div>

                <!-- Filter (List mode) -->
                <div v-if="viewMode === 'list'"
                    class="flex p-1.5 bg-glass border border-glass rounded-2xl shadow-inner">
                    <button v-for="filter in ['all', 'active', 'done']" :key="filter" @click="activeFilter = filter"
                        class="px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 capitalize"
                        :class="activeFilter === filter ? 'bg-accent-primary text-bg-primary shadow-lg' : 'text-text-secondary hover:text-text-primary'">
                        {{ filter }}
                    </button>
                </div>

                <!-- Export Menu -->
                <div class="relative group/export">
                    <button
                        class="flex items-center gap-2 p-2.5 rounded-xl bg-glass border border-glass text-slate-400 hover:text-white transition-all">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span class="text-xs font-bold uppercase tracking-wider hidden md:block">Export</span>
                    </button>
                    <div
                        class="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-50 overflow-hidden">
                        <div class="px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Export
                                System</span>
                        </div>
                        <div class="p-2 space-y-1">
                            <div v-for="fmt in ['json', 'yaml', 'xml', 'md', 'txt']" :key="fmt"
                                class="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 transition-colors group/row">
                                <span class="text-xs font-mono font-bold text-slate-400 group-hover/row:text-white">{{
                                    fmt.toUpperCase() }}</span>
                                <div class="flex gap-1">
                                    <button @click="exportTasks(fmt as any, 'download')"
                                        class="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                                        title="Download">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                    <button @click="exportTasks(fmt as any, 'copy')"
                                        class="p-2 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                        title="Copy to Clipboard">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- View Toggle -->
                <div class="flex p-1 bg-glass border border-glass rounded-xl">
                    <button @click="viewMode = 'list'" class="p-2.5 rounded-lg transition-all"
                        :class="viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                    <button @click="viewMode = 'kanban'" class="p-2.5 rounded-lg transition-all"
                        :class="viewMode === 'kanban' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-white'">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Quick Add -->
        <form @submit.prevent="addTask" class="relative group z-10">
            <div
                class="absolute -inset-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000">
            </div>
            <div
                class="relative flex flex-col gap-3 bg-glass backdrop-blur-xl border border-glass rounded-2xl p-2 shadow-xl transition-all">
                <div class="flex gap-3">
                    <input type="text" v-model="newTaskTitle"
                        class="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:ring-0 py-2 px-4 text-lg font-medium outline-none"
                        placeholder="New Action Item..." required />
                    <select v-model="newTaskCategory"
                        class="w-40 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 text-sm outline-none focus:border-purple-500">
                        <option :value="null">No category</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.emoji }} {{ cat.label }}
                        </option>
                    </select>
                    <select v-model="newTaskOKRLink"
                        class="w-48 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 text-sm outline-none focus:border-purple-500">
                        <option :value="null">Strategic Link: None</option>
                        <optgroup v-for="okr in okrs" :key="okr.id" :label="okr.objective">
                            <option v-for="kr in okr.keyResults" :key="kr.id" :value="`${okr.id}|${kr.id}`">
                                {{ kr.description }}
                            </option>
                        </optgroup>
                    </select>
                    <button type="submit" :disabled="!newTaskTitle.trim()"
                        class="px-6 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        Create
                    </button>
                </div>
                <!-- Optional Description -->
                <div class="px-4 pb-2">
                    <input v-model="newTaskDescription" type="text"
                        class="w-full bg-transparent border-none text-slate-400 placeholder-slate-600 text-sm focus:ring-0 p-0 outline-none"
                        placeholder="Add a description (optional)..." />
                </div>
            </div>
        </form>

        <!-- LIST VIEW -->
        <div v-if="viewMode === 'list'" class="space-y-4">
            <TransitionGroup name="list">
                <div v-for="task in filteredListTasks" :key="task.id"
                    class="group flex items-start gap-6 p-5 bg-glass border border-glass rounded-2xl hover:bg-glass/80 hover:border-accent-primary/30 transition-all duration-300 shadow-lg"
                    :class="{ 'opacity-60 grayscale-[0.5]': task.status === 'done' }">
                    <!-- Status Toggle -->
                    <button @click="toggleTask(task)"
                        class="flex-shrink-0 mt-1 h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all duration-500 relative overflow-hidden"
                        :class="task.status === 'done' ? 'bg-indigo-600 border-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'border-slate-700 hover:border-indigo-400'">
                        <svg v-if="task.status === 'done'" class="w-5 h-5 text-white animate-scale-in" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5"
                                d="M5 13l4 4L19 7" />
                        </svg>
                    </button>

                    <div class="flex-grow min-w-0">
                        <div class="flex items-center gap-3">
                            <input v-model.lazy="task.title" @change="updateTitle(task)"
                                class="flex-1 bg-transparent border-none text-slate-100 focus:ring-0 p-0 text-xl font-bold tracking-tight outline-none"
                                :class="{ 'line-through text-slate-500': task.status === 'done' }" />
                            <span v-if="task.category"
                                class="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                :class="getCategoryInfo(task.category)?.color">
                                {{ getCategoryInfo(task.category)?.emoji }} {{ getCategoryInfo(task.category)?.label }}
                            </span>
                            <span v-if="task.okrId"
                                class="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                🎯 {{ getLinkedOKRInfo(task.okrId, task.krId)?.krDescription }}
                            </span>
                        </div>
                        <p v-if="task.description" class="text-slate-400 text-sm mt-1 line-clamp-2">{{ task.description
                            }}</p>
                        <p class="text-[10px] font-mono text-slate-600 uppercase tracking-widest mt-2">
                            {{ task.status === 'done' ? 'Completed' : task.status === 'focus' ? 'Today\'s Focus' :
                                'Active' }} • ID: {{ task.id.slice(0, 8) }}
                        </p>
                    </div>

                    <button @click="deleteTask(task.id)"
                        class="opacity-0 group-hover:opacity-100 mt-1 h-10 w-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all duration-300">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </TransitionGroup>

            <div v-if="filteredListTasks.length === 0" class="text-center py-24 group">
                <div
                    class="inline-flex h-24 w-24 items-center justify-center rounded-full bg-glass border border-glass group-hover:border-accent-primary/50 transition-all duration-500 mb-8">
                    <svg class="w-10 h-10 text-slate-600 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p class="text-2xl font-bold text-slate-500">No tasks found.</p>
                <p class="text-slate-600 mt-2">Add a new task above to get started.</p>
            </div>
        </div>

        <!-- KANBAN VIEW -->
        <div v-if="viewMode === 'kanban'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Backlog Column -->
            <div class="space-y-4">
                <div class="flex items-center gap-3 px-2">
                    <div class="w-3 h-3 rounded-full bg-slate-500"></div>
                    <h2 class="text-lg font-bold text-slate-400">Backlog</h2>
                    <span class="text-sm text-slate-600">({{ backlogTasks.length }})</span>
                </div>
                <VueDraggable v-model="backlogList" group="tasks" :animation="150" ghost-class="ghost"
                    class="space-y-3 min-h-[200px] p-3 bg-glass border border-glass rounded-2xl">
                    <div v-for="task in backlogList" :key="task.id"
                        class="group p-4 bg-glass border border-glass rounded-xl hover:border-text-secondary/30 transition-all cursor-grab active:cursor-grabbing">
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <span class="font-semibold text-slate-200">{{ task.title }}</span>
                            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="handleAddToFocus(task.id)"
                                    class="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/40 text-xs"
                                    title="Add to Focus">⭐</button>
                                <button @click="deleteTask(task.id)"
                                    class="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/40 text-xs"
                                    title="Delete">🗑️</button>
                            </div>
                        </div>
                        <p v-if="task.description" class="text-xs text-slate-500 mb-2 line-clamp-2">{{ task.description
                            }}</p>
                        <div class="flex flex-wrap gap-1">
                            <span v-if="task.category"
                                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                :class="getCategoryInfo(task.category)?.color">
                                {{ getCategoryInfo(task.category)?.emoji }} {{ getCategoryInfo(task.category)?.label }}
                            </span>
                            <span v-if="task.okrId"
                                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                🎯 {{ getLinkedOKRInfo(task.okrId, task.krId)?.krDescription }}
                            </span>
                        </div>
                    </div>
                </VueDraggable>
                <p v-if="backlogTasks.length === 0" class="text-center py-8 text-slate-600 text-sm">No tasks in backlog
                </p>
            </div>

            <!-- Today's Focus Column -->
            <div class="space-y-4">
                <div class="flex items-center gap-3 px-2">
                    <div class="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                    <h2 class="text-lg font-bold text-purple-400">Today's Focus</h2>
                    <span class="text-sm text-purple-600">({{ focusTasks.length }}/6)</span>
                </div>
                <VueDraggable v-model="focusList" group="tasks" :animation="150" ghost-class="ghost"
                    :move="checkFocusLimit"
                    class="space-y-3 min-h-[200px] p-3 bg-purple-950/20 border border-purple-800/30 rounded-2xl ring-1 ring-purple-500/10">
                    <div v-for="task in focusList" :key="task.id"
                        class="group p-4 bg-glass border border-glass rounded-xl hover:border-accent-primary/50 transition-all cursor-grab active:cursor-grabbing">
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <div>
                                <span class="text-xs font-bold text-purple-400 mr-2">#{{ task.focusOrder }}</span>
                                <span class="font-semibold text-slate-200">{{ task.title }}</span>
                            </div>
                            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="handleMoveToDoing(task.id)"
                                    class="p-1.5 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/40 text-xs"
                                    title="Start Working">▶️</button>
                                <button @click="handleRemoveFromFocus(task.id)"
                                    class="p-1.5 rounded-lg bg-slate-600/20 text-slate-400 hover:bg-slate-600/40 text-xs"
                                    title="Remove">↩️</button>
                            </div>
                        </div>
                        <p v-if="task.description" class="text-xs text-slate-500 mb-2 line-clamp-2">{{ task.description
                            }}</p>
                        <span v-if="task.category"
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            :class="getCategoryInfo(task.category)?.color">
                            {{ getCategoryInfo(task.category)?.emoji }} {{ getCategoryInfo(task.category)?.label }}
                        </span>
                    </div>
                </VueDraggable>
                <div v-if="focusTasks.length === 0" class="text-center py-8">
                    <p class="text-purple-600 text-sm">Add tasks for today's focus</p>
                    <p class="text-purple-700 text-xs mt-1">Maximum 6 tasks</p>
                </div>
            </div>

            <!-- In Progress Column -->
            <div class="space-y-4">
                <div class="flex items-center gap-3 px-2">
                    <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                    <h2 class="text-lg font-bold text-amber-400">In Progress</h2>
                    <span class="text-sm text-amber-600">({{ doingTasks.length }})</span>
                </div>
                <VueDraggable v-model="doingList" group="tasks" :animation="150" ghost-class="ghost"
                    class="space-y-3 min-h-[200px] p-3 bg-amber-950/20 border border-amber-800/30 rounded-2xl">
                    <div v-for="task in doingList" :key="task.id"
                        class="group p-4 bg-glass border border-glass rounded-xl hover:border-accent-secondary/50 transition-all cursor-grab active:cursor-grabbing">
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <span class="font-semibold text-slate-200">{{ task.title }}</span>
                            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="handleMarkDone(task.id)"
                                    class="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 text-xs"
                                    title="Done">✓</button>
                                <button @click="handleMoveBack(task.id)"
                                    class="p-1.5 rounded-lg bg-slate-600/20 text-slate-400 hover:bg-slate-600/40 text-xs"
                                    title="Back">↩️</button>
                            </div>
                        </div>
                        <p v-if="task.description" class="text-xs text-slate-500 mb-2 line-clamp-2">{{ task.description
                            }}</p>
                        <span v-if="task.category"
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            :class="getCategoryInfo(task.category)?.color">
                            {{ getCategoryInfo(task.category)?.emoji }} {{ getCategoryInfo(task.category)?.label }}
                        </span>
                    </div>
                </VueDraggable>
                <p v-if="doingTasks.length === 0" class="text-center py-8 text-amber-700 text-sm">Start working on a
                    focus task</p>
            </div>

            <!-- Done Column -->
            <div class="space-y-4">
                <div class="flex items-center gap-3 px-2">
                    <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <h2 class="text-lg font-bold text-emerald-400">Done</h2>
                    <span class="text-sm text-emerald-600">({{ doneTasks.length }})</span>
                </div>
                <VueDraggable v-model="doneList" group="tasks" :animation="150" ghost-class="ghost"
                    class="space-y-3 min-h-[200px] p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-2xl">
                    <div v-for="task in doneList" :key="task.id"
                        class="group p-4 bg-glass border border-glass rounded-xl hover:border-text-secondary/30 transition-all opacity-70 cursor-grab active:cursor-grabbing">
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <span class="font-semibold text-slate-500 line-through">{{ task.title }}</span>
                            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="handleArchive(task.id)"
                                    class="p-1.5 rounded-lg bg-slate-600/20 text-slate-400 hover:bg-slate-600/40 text-xs"
                                    title="Archive">📦</button>
                            </div>
                        </div>
                        <p v-if="task.description" class="text-xs text-slate-500 mb-2 line-clamp-2">{{ task.description
                            }}</p>
                        <span v-if="task.category"
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            :class="getCategoryInfo(task.category)?.color">
                            {{ getCategoryInfo(task.category)?.emoji }} {{ getCategoryInfo(task.category)?.label }}
                        </span>
                    </div>
                </VueDraggable>
                <p v-if="doneTasks.length === 0" class="text-center py-8 text-emerald-700 text-sm">Completed tasks
                    appear here</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTasksStore } from '~/stores/tasks'
import { useStrategyStore } from '~/stores/strategy'
import { useTaskPreferences } from '~/composables/useTaskPreferences'
import { useExport } from '~/composables/useExport'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import { collection, query, where } from 'firebase/firestore'
import type { Task } from '~/types'

import { VueDraggable } from 'vue-draggable-plus'
import type { SortableEvent } from 'sortablejs'

// ... existing imports ...
const user = useCurrentUser()
const db = useFirestore()
const store = useTasksStore()
const strategyStore = useStrategyStore()
const { exportTasks: performExport } = useExport()
const { categories, getCategoryById } = useTaskPreferences()

const exportTasks = (format: 'json' | 'yaml' | 'xml' | 'md' | 'txt', mode: 'download' | 'copy' = 'download') => {
    performExport(tasks.value || [], format, mode)
}

const newTaskTitle = ref('')
const newTaskDescription = ref('')
const newTaskCategory = ref<string | null>(null)
const newTaskOKRLink = ref<string | null>(null)
const activeFilter = ref('all')
const route = useRoute()
const router = useRouter()
const viewMode = computed({
    get: () => (route.query.view as 'list' | 'kanban') || 'list',
    set: (val) => router.replace({ query: { ...route.query, view: val } })
})

const getCategoryInfo = (cat: string | null | undefined) => {
    return getCategoryById(cat)
}

const okrs = computed(() => strategyStore.okrs || [])

const getLinkedOKRInfo = (okrId: string | null | undefined, krId: string | null | undefined) => {
    if (!okrId || !krId) return null
    const okr = okrs.value.find(o => o.id === okrId)
    if (!okr) return null
    const kr = okr.keyResults.find(k => k.id === krId)
    return {
        objective: okr.objective,
        krDescription: kr?.description || 'Unknown Key Result'
    }
}

const today = store.getTodayISO()
const todayFormatted = computed(() => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
})

const tasksQuery = computed(() => {
    if (!user.value) return null
    return query(
        collection(db, 'tasks'),
        where('userId', '==', user.value.uid),
        where('status', 'in', ['backlog', 'focus', 'doing', 'done'])
    )
})

const tasks = useCollection<Task>(tasksQuery)

// List view filtered tasks - prioritize focus and in-progress tasks
const filteredListTasks = computed(() => {
    if (!tasks.value) return []

    // Priority order: focus > doing > backlog > done
    const statusPriority: Record<string, number> = { focus: 0, doing: 1, backlog: 2, done: 3 }

    const sorted = [...tasks.value].sort((a, b) => {
        // First sort by status priority
        const aPriority = statusPriority[a.status] ?? 4
        const bPriority = statusPriority[b.status] ?? 4
        if (aPriority !== bPriority) return aPriority - bPriority

        // Within focus, sort by focusOrder
        if (a.status === 'focus' && b.status === 'focus') {
            return (a.focusOrder || 0) - (b.focusOrder || 0)
        }

        // Within others, sort by rank if available, else date
        const aRank = a.rank ?? 0
        const bRank = b.rank ?? 0
        if (aRank !== bRank) return aRank - bRank

        // Then by creation date
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    })

    if (activeFilter.value === 'active') return sorted.filter(t => t.status !== 'done' && t.status !== 'archived')
    if (activeFilter.value === 'done') return sorted.filter(t => t.status === 'done')
    return sorted.filter(t => t.status !== 'archived')
})

// Kanban columns
const backlogTasks = computed(() => (tasks.value?.filter(t => t.status === 'backlog') || []).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)))
const focusTasks = computed(() =>
    (tasks.value?.filter(t => t.status === 'focus' && t.focusDate === today) || [])
        .sort((a, b) => (a.focusOrder || 0) - (b.focusOrder || 0))
)
const doingTasks = computed(() => (tasks.value?.filter(t => t.status === 'doing') || []).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)))
const doneTasks = computed(() =>
    (tasks.value?.filter(t => t.status === 'done') || [])
        .sort((a, b) => (b.completedAt?.seconds || 0) - (a.completedAt?.seconds || 0))
        .slice(0, 10)
)
const focusCount = computed(() => focusTasks.value.length)

// Draggable Lists
const backlogList = computed({
    get: () => backlogTasks.value,
    set: (val) => store.batchReorderTasks(val, 'backlog')
})

const focusList = computed({
    get: () => focusTasks.value,
    set: (val) => store.batchReorderTasks(val, 'focus')
})

const doingList = computed({
    get: () => doingTasks.value,
    set: (val) => store.batchReorderTasks(val, 'doing')
})

const doneList = computed({
    get: () => doneTasks.value,
    set: (val) => store.batchReorderTasks(val, 'done')
})

const checkFocusLimit = (evt: any) => {
    // If dragging to focus column (which is wrapped in specific class or we can check list length)
    // Check if target has 6 items?
    // This is tricky referencing the computed from here inside the sortable callback context sometimes.
    // For now allow, if > 6, store might act weird or just allow 7th item until refresh.
    // Better to strict limit:
    if (evt.to.classList.contains('ring-1') && focusTasks.value.length >= 6) { // Focus col has ring-1
        // Only allow if sorting within same list
        if (evt.from === evt.to) return true
        return false
    }
    return true
}

// Actions
const addTask = async () => {
    if (!newTaskTitle.value.trim()) return

    let okrId: string | undefined
    let krId: string | undefined

    if (newTaskOKRLink.value) {
        const [oid, kid] = newTaskOKRLink.value.split('|')
        okrId = oid
        krId = kid
    }

    await store.addTask(newTaskTitle.value, {
        category: newTaskCategory.value ?? undefined,
        description: newTaskDescription.value.trim() || undefined,
        okrId,
        krId
    })
    newTaskTitle.value = ''
    newTaskDescription.value = ''
    newTaskCategory.value = null
    newTaskOKRLink.value = null
}

const toggleTask = async (task: Task) => {
    const newStatus = task.status === 'done' ? 'backlog' : 'done'
    await store.updateTaskStatus(task.id, newStatus)
}

const updateTitle = async (task: Task) => {
    await store.updateTaskTitle(task.id, task.title)
}

const deleteTask = async (id: string) => {
    if (confirm('Delete this task?')) {
        await store.deleteTask(id)
    }
}

const handleAddToFocus = async (id: string) => {
    try {
        await store.addToFocus(id, tasks.value || [])
    } catch (e: any) {
        alert(e.message)
    }
}

const handleRemoveFromFocus = async (id: string) => {
    await store.removeFromFocus(id)
}

const handleMoveToDoing = async (id: string) => {
    await store.updateTaskStatus(id, 'doing')
}

const handleMoveBack = async (id: string) => {
    await store.updateTaskStatus(id, 'focus')
}

const handleMarkDone = async (id: string) => {
    await store.updateTaskStatus(id, 'done')
}

const handleArchive = async (id: string) => {
    await store.archiveTask(id)
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

.ghost {
    opacity: 0.5;
    background: rgba(100, 116, 139, 0.2);
    border: 1px dashed rgba(148, 163, 184, 0.5);
}
</style>
