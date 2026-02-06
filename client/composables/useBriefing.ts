import { ref, computed } from 'vue'
import { useDaily } from './useDaily'
import { useTasksStore } from '~/stores/tasks'
import { useCurrentUser, useFirestore, useCollection } from 'vuefire'
import { collection, query, where, orderBy, limit } from 'firebase/firestore'
import { inspirationalMessages } from '~/config/data'

export interface BriefingConfig {
    showGreeting: boolean
    showQuote: boolean
    showTopTask: boolean
    showInspiration: boolean
}

export const useBriefing = () => {
    const user = useCurrentUser()
    const db = useFirestore()
    const { dailySnapshot, fetchDaily, loading: dailyLoading } = useDaily()
    const tasksStore = useTasksStore()

    // Configuration
    const defaultConfig: BriefingConfig = {
        showGreeting: true,
        showQuote: true,
        showTopTask: true,
        showInspiration: true
    }
    const config = ref<BriefingConfig>(defaultConfig)

    // Load/Save config
    onMounted(() => {
        const saved = localStorage.getItem('hq-briefing-config')
        if (saved) {
            try {
                config.value = { ...defaultConfig, ...JSON.parse(saved) }
            } catch (e) {
                console.error("Failed to parse briefing config", e)
            }
        }
    })

    const updateConfig = (newConfig: Partial<BriefingConfig>) => {
        config.value = { ...config.value, ...newConfig }
        localStorage.setItem('hq-briefing-config', JSON.stringify(config.value))
    }

    // Derived State from Daily Snapshot
    const dailyContent = computed(() => dailySnapshot.value?.quote || null)
    const topTask = computed(() => dailySnapshot.value?.tasks?.topTask || null)
    const todayEvents = computed(() => dailySnapshot.value?.events || [])
    const systemMetadata = computed(() => dailySnapshot.value?.metadata || null)

    const greeting = computed(() => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
    })

    const todayFormatted = computed(() => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        }).format(new Date())
    })

    const randomInspiration = computed(() => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
        return inspirationalMessages[dayOfYear % inspirationalMessages.length]
    })

    return {
        greeting,
        todayFormatted,
        dailyContent,
        fetchDaily,
        dailyLoading,
        randomInspiration,
        topTask,
        todayEvents,
        systemMetadata,
        config,
        updateConfig
    }
}
