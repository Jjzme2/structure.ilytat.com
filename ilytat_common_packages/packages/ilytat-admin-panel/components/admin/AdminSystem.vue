<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCurrentUser, getCurrentUser } from 'vuefire'
import type { ActivityItem } from '../../types/admin'

const { success, error, info, warning } = useToast()
const { sendEmail } = useEmail()
const user = useCurrentUser()
const audit = useActivityLog()

const logs = ref<ActivityItem[]>([])
const refreshing = ref(false)

const refreshLogs = async () => {
    refreshing.value = true
    try {
        logs.value = await audit.adminFetchRecent(50)
    } finally {
        refreshing.value = false
    }
}

onMounted(refreshLogs)

const testToasts = () => {
    success('System integrity verified')
    setTimeout(() => error('Simulated access violation'), 1000)
    setTimeout(() => info('Diagnostic complete'), 2000)
    setTimeout(() => warning('Bandwidth threshold alert'), 3000)
}

const sending = ref(false)
const emailMessage = ref('')
const emailSuccess = ref(false)

const migrating = ref(false)
const seeding = ref(false)
const validating = ref(false)
const seedingProfile = ref(false)

const runMigration = async () => {
    if (!confirm('Execute multi-tenant migration?')) return
    migrating.value = true
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()
        await $fetch('/api/migration/v2_multitenant', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        })
        await audit.log('V2 Migration Executed', 'admin-system', { status: 'success' })
        success('Migration completed successfully')
    } catch (e: any) {
        console.error(e)
        error('Migration failed: ' + e.message)
    } finally {
        migrating.value = false
        refreshLogs()
    }
}

const seedBriefing = async () => {
    if (!confirm('Seed the briefing data?')) return
    seeding.value = true
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()
        await $fetch('/api/migration/v3_seed_briefings', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        })
        await audit.log('Briefing Data Seeded', 'admin-system', { status: 'success' })
        success('Briefing data seeded')
    } catch (e: any) {
        error('Seeding failed: ' + e.message)
    } finally {
        seeding.value = false
        refreshLogs()
    }
}

const validateData = async () => {
    validating.value = true
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()
        await $fetch('/api/migration/v4_validate_data', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        })
        await audit.log('Data Integrity Check Executed', 'admin-system', { status: 'success' })
        info('Integrity check initiated')
    } catch (e: any) {
        error('Validation failed: ' + e.message)
    } finally {
        validating.value = false
        refreshLogs()
    }
}

const seedProfile = async () => {
    seedingProfile.value = true
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()
        await $fetch('/api/migration/v5_seed_user_profile', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        })
    } finally {
        seedingProfile.value = false
    }
}

const testEmail = async () => {
    if (!user.value) return
    sending.value = true
    emailMessage.value = ''

    try {
        const result = await sendEmail({
            to_email: user.value.email!,
            subject: 'System Diagnostic: Email Gateway',
            message: 'This is a pulse-check for the automated email dispatch system.'
        })

        if (result.success) {
            emailSuccess.value = true
            emailMessage.value = 'Dispatcher response: SUCCESS'
        } else {
            emailSuccess.value = false
            emailMessage.value = 'Dispatcher response: FAILED'
        }
    } catch (e: any) {
        emailSuccess.value = false
        emailMessage.value = e.message
    } finally {
        sending.value = false
    }
}
const expandedLogs = ref<Record<string, boolean>>({})
const selectedLog = ref<ActivityItem | null>(null)

const handleLogClick = (log: ActivityItem) => {
    // Check if desktop (lg breakpoint)
    if (window.innerWidth >= 1024) {
        selectedLog.value = log
    } else {
        // Mobile behavior: Toggle inline
        expandedLogs.value[log.id] = !expandedLogs.value[log.id]
    }
}

const closeLogModal = () => {
    selectedLog.value = null
}

const searchQuery = ref('')

const filteredLogs = computed(() => {
    if (!searchQuery.value.trim()) return logs.value

    const query = searchQuery.value.toLowerCase()
    return logs.value.filter(log => {
        const matchesAction = log.action.toLowerCase().includes(query)
        const matchesModule = log.module.toLowerCase().includes(query)
        const matchesUser = log.userId?.toLowerCase().includes(query)
        const matchesMetadata = JSON.stringify(log.metadata).toLowerCase().includes(query)

        return matchesAction || matchesModule || matchesUser || matchesMetadata
    })
})
</script>



<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        <div class="space-y-6">
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-amber-500 mb-4 tracking-widest uppercase text-sm">Hardware & Modules
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button @click="testToasts"
                        class="p-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-amber-500 transition-colors text-left group">
                        <div class="text-amber-500 mb-1 group-hover:scale-110 transition-transform">🔔</div>
                        <div class="text-white font-bold text-sm">Toast Array</div>
                        <p class="text-[10px] text-slate-500 mt-1">Verify global alert overlay system.</p>
                    </button>

                    <button @click="testEmail" :disabled="sending"
                        class="p-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-amber-500 transition-colors text-left group disabled:opacity-50">
                        <div class="text-amber-500 mb-1 group-hover:scale-110 transition-transform">📧</div>
                        <div class="text-white font-bold text-sm">{{ sending ? 'Dispatching...' : 'Email Relay' }}</div>
                        <p class="text-[10px] text-slate-500 mt-1">Pulse-check EmailJS smtp bridge.</p>
                    </button>
                </div>
                <div v-if="emailMessage" class="mt-4 p-3 rounded-lg text-[10px] font-mono border"
                    :class="emailSuccess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'">
                    {{ emailMessage }}
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-amber-500 mb-4 tracking-widest uppercase text-sm">System Operations
                </h3>
                <div class="space-y-3">
                    <button @click="runMigration" :disabled="migrating"
                        class="w-full flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700/50 hover:border-amber-500/50 transition-colors group">
                        <span class="text-xs text-slate-300 font-mono">Run V2 Migration</span>
                        <span v-if="migrating" class="animate-spin text-xs">⏳</span>
                        <span v-else
                            class="text-amber-500 text-xs font-bold group-hover:translate-x-1 transition-transform">EXEC</span>
                    </button>
                    <button @click="seedBriefing" :disabled="seeding"
                        class="w-full flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700/50 hover:border-amber-500/50 transition-colors group">
                        <span class="text-xs text-slate-300 font-mono">Seed Content</span>
                        <span v-if="seeding" class="animate-spin text-xs">⏳</span>
                        <span v-else
                            class="text-amber-500 text-xs font-bold group-hover:translate-x-1 transition-transform">EXEC</span>
                    </button>
                    <button @click="validateData" :disabled="validating"
                        class="w-full flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700/50 hover:border-amber-500/50 transition-colors group">
                        <span class="text-xs text-slate-300 font-mono">Integrity Check</span>
                        <span v-if="validating" class="animate-spin text-xs">🔍</span>
                        <span v-else
                            class="text-amber-500 text-xs font-bold group-hover:translate-x-1 transition-transform">EXEC</span>
                    </button>
                    <button @click="seedProfile" :disabled="seedingProfile"
                        class="w-full flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700/50 hover:border-amber-500/50 transition-colors group">
                        <span class="text-xs text-slate-300 font-mono">Profile Hydration</span>
                        <span v-if="seedingProfile" class="animate-spin text-xs">👤</span>
                        <span v-else
                            class="text-amber-500 text-xs font-bold group-hover:translate-x-1 transition-transform">EXEC</span>
                    </button>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 class="text-lg font-bold text-amber-500 mb-4 tracking-widest uppercase text-sm">System Environment
                </h3>
                <div class="space-y-3">
                    <div v-for="core in ['Kernel', 'Storage', 'Realtime', 'Search']" :key="core"
                        class="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700/50">
                        <span class="text-xs text-slate-300 font-mono">{{ core }}_v4.2.0</span>
                        <span
                            class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-bold rounded uppercase">Active</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col h-[600px]">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                    <h3 class="text-lg font-bold text-amber-500 tracking-widest uppercase text-sm">Audit Logs</h3>
                    <input v-model="searchQuery" type="text" placeholder="Search logs..."
                        class="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-300 placeholder-slate-600 focus:border-amber-500/50 focus:outline-none transition-colors w-40 lg:w-64" />
                </div>
                <button @click="refreshLogs"
                    class="text-[10px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest"
                    :disabled="refreshing">
                    {{ refreshing ? 'Syncing...' : 'Sync Logs' }}
                </button>
            </div>

            <div class="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                <div v-for="log in filteredLogs" :key="log.id"
                    class="p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-500 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-amber-500 font-mono text-[10px] font-bold uppercase">{{ log.action }}</span>
                        <span class="text-slate-500 text-[9px] font-mono">{{ log.timestamp?.toDate?.()?.toLocaleString()
                        }}</span>
                    </div>
                    <div class="flex gap-2 mb-2">
                        <span
                            class="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Module:
                            {{ log.module }}</span>
                        <span
                            class="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">ID:
                            {{ log.userId ? log.userId.slice(0, 8) : 'SYSTEM' }}</span>
                    </div>

                    <!-- Expandable Metadata (Mobile/Inline) and Modal Trigger (Desktop) -->
                    <div @click="handleLogClick(log)" class="cursor-pointer group relative">
                        <pre class="text-[9px] text-slate-500 bg-black/40 p-2 rounded overflow-hidden transition-all duration-300"
                            :class="expandedLogs[log.id] ? 'max-h-[500px] overflow-auto' : 'max-h-12 opacity-80'">{{ JSON.stringify(log.metadata, null, 2) }}</pre>

                        <!-- Gradient Overlay when collapsed -->
                        <div v-if="!expandedLogs[log.id]"
                            class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none lg:hidden">
                        </div>

                        <!-- Gradient Overlay (Desktop - always collapsed inline) -->
                        <div
                            class="hidden lg:block absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none">
                        </div>

                        <!-- Hints -->
                        <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <!-- Mobile Hint -->
                            <span
                                class="lg:hidden text-[8px] text-amber-500 bg-black/80 px-1.5 py-0.5 rounded border border-amber-900/50 font-bold tracking-wider">
                                {{ expandedLogs[log.id] ? 'COLLAPSE' : 'EXPAND' }}
                            </span>
                            <!-- Desktop Hint -->
                            <span
                                class="hidden lg:inline-block text-[8px] text-amber-500 bg-black/80 px-1.5 py-0.5 rounded border border-amber-900/50 font-bold tracking-wider">
                                VIEW DETAILS
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Audit Log Detail Modal -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scal-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="selectedLog" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    @click.self="closeLogModal">
                    <!-- Backdrop -->
                    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="closeLogModal"></div>

                    <!-- Modal Content -->
                    <div
                        class="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/90 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <!-- Header -->
                        <div class="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900">
                            <div class="flex items-center gap-3">
                                <span class="text-amber-500 font-mono text-sm font-bold uppercase tracking-widest">{{
                                    selectedLog.action }}</span>
                                <span class="text-slate-500 text-xs font-mono px-2 py-0.5 bg-slate-800 rounded">{{
                                    selectedLog.module }}</span>
                            </div>
                            <button @click="closeLogModal"
                                class="text-slate-400 hover:text-white transition-colors p-1">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Body -->
                        <div class="p-6 overflow-y-auto font-mono text-sm space-y-6">

                            <!-- Metadata Grid -->
                            <div class="grid grid-cols-2 gap-4 text-xs">
                                <div class="p-3 rounded-lg bg-slate-950 border border-slate-800">
                                    <span
                                        class="block text-slate-500 mb-1 uppercase tracking-widest text-[9px]">Timestamp</span>
                                    <span class="text-emerald-400">{{
                                        selectedLog.timestamp?.toDate?.()?.toLocaleString() ?? 'N/A' }}</span>
                                </div>
                                <div class="p-3 rounded-lg bg-slate-950 border border-slate-800">
                                    <span class="block text-slate-500 mb-1 uppercase tracking-widest text-[9px]">User
                                        ID</span>
                                    <span class="text-indigo-400 break-all">{{ selectedLog.userId }}</span>
                                </div>
                            </div>

                            <!-- Payload -->
                            <div class="space-y-2">
                                <span class="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Event
                                    Payload</span>
                                <div class="relative group/copy">
                                    <pre
                                        class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto text-xs leading-relaxed selection:bg-amber-500/30">{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
                                </div>
                            </div>

                            <!-- System Info -->
                            <div
                                class="flex gap-4 text-[10px] text-slate-600 uppercase tracking-widest pt-4 border-t border-slate-800/50">
                                <span>Security Level: CLASS 3</span>
                                <span>Event ID: {{ selectedLog.id }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>
