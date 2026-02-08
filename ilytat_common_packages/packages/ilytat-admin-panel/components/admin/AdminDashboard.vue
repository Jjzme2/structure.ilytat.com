<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <div v-for="stat in stats" :key="stat.label" class="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div class="text-slate-400 text-xs uppercase tracking-widest mb-1">{{ stat.label }}</div>
            <div class="text-3xl font-bold text-white">{{ stat.value }}</div>
            <div class="text-xs mt-2" :class="stat.trend > 0 ? 'text-emerald-400' : 'text-rose-400'">
                {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}% from last month
            </div>
        </div>

        <div class="md:col-span-2 lg:col-span-3 bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <h3 class="text-lg font-bold text-amber-500 mb-4">System Health</h3>
            <div class="space-y-4">
                <div v-for="service in services" :key="service.name" class="flex items-center justify-between">
                    <span class="text-slate-300">{{ service.name }}</span>
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full"
                            :class="service.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                        <span class="text-xs uppercase tracking-wider text-slate-500">{{ service.status }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="lg:col-span-1 bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <h3 class="text-lg font-bold text-amber-500 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 gap-3">
                <button
                    class="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors text-left">
                    Flush Redis Cache
                </button>
                <button
                    class="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors text-left">
                    Rotate API Keys
                </button>
                <button
                    class="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-colors text-left">
                    Download Backups
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, query, where, getCountFromServer } from 'firebase/firestore'

const db = useFirestore()
const { services, checkHealth } = useSystemHealth()
const stats = ref([
    { label: 'Total Users', value: '...', trend: 0 },
    { label: 'Active Tasks', value: '...', trend: 0 },
    { label: 'Audit Events', value: '...', trend: 0 },
    { label: 'System Uptime', value: '99.98%', trend: 0 },
])


const loadStats = async () => {
    try {
        // Parallel load for better performance
        const [usersCount, activeTasksCount, activitiesCount] = await Promise.all([
            getCountFromServer(collection(db, 'users')),
            getCountFromServer(query(collection(db, 'tasks'), where('status', '!=', 'completed'))),
            getCountFromServer(collection(db, 'activities'))
        ])

        const totalUsers = usersCount.data().count
        const activeTasks = activeTasksCount.data().count
        const auditEvents = activitiesCount.data().count

        stats.value = [
            { label: 'Total Users', value: totalUsers.toLocaleString(), trend: 4 },
            { label: 'Active Tasks', value: activeTasks.toLocaleString(), trend: -2 },
            { label: 'Audit Events', value: auditEvents.toLocaleString(), trend: 15 },
            { label: 'System Uptime', value: '99.98%', trend: 0 },
        ]

        await checkHealth()

    } catch (e) {
        console.error('Failed to load admin stats:', e)
    }
}

onMounted(loadStats)
</script>
