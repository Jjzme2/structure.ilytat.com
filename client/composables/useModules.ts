
export interface Module {
    id: string
    name: string
    path: string
    icon: string
    description: string
    enabled: boolean
    status: 'active' | 'beta' | 'planned'
    public: boolean
    category: 'focus' | 'assets' | 'vision'
    colorClass: string
    iconBgClass: string
    query?: Record<string, string>
}

export const useModules = () => {
    // In a real app, 'enabled' might come from an API or config file
    const modules = ref<Module[]>([
        {
            id: 'tasks',
            name: 'Operations',
            path: '/tasks',
            icon: 'tasks',
            description: 'Tactical task management and execution protocols.',
            enabled: true,
            status: 'active',
            public: false,
            category: 'focus',
            colorClass: 'from-indigo-500 to-blue-600',
            iconBgClass: 'bg-indigo-600 shadow-indigo-500/20'
        },
        {
            id: 'documents',
            name: 'Documents',
            path: '/documents',
            icon: 'notes',
            description: 'Knowledge base and strategic documentation.',
            enabled: true,
            status: 'active',
            public: false,
            category: 'assets',
            colorClass: 'from-pink-500 to-rose-600',
            iconBgClass: 'bg-pink-600 shadow-pink-500/20'
        },
        {
            id: 'dates',
            name: 'Schedule',
            path: '/dates',
            icon: 'dates',
            description: 'Key dates and fiscal milestones.',
            enabled: true,
            status: 'active',
            public: false,
            category: 'focus',
            colorClass: 'from-cyan-500 to-teal-600',
            iconBgClass: 'bg-cyan-600 shadow-cyan-500/20'
        },
        {
            id: 'item_quotes',
            name: 'Quotes',
            path: '/quotes',
            icon: 'quotes',
            description: 'Daily inspiration and wisdom.',
            enabled: false,
            status: 'planned',
            public: true,
            category: 'vision',
            colorClass: 'from-amber-500 to-orange-600',
            iconBgClass: 'bg-amber-600 shadow-amber-500/20'
        },
        {
            id: 'supply',
            name: 'Asset Registry',
            path: '/supply',
            icon: 'archive',
            description: 'Inventory tracking and digital subscription oversight.',
            enabled: true,
            status: 'beta',
            public: false,
            category: 'assets',
            colorClass: 'from-emerald-500 to-teal-600',
            iconBgClass: 'bg-emerald-600 shadow-emerald-500/20'
        },
        {
            id: 'strategy',
            name: 'Strategy',
            path: '/strategy',
            icon: 'target',
            description: 'Objectives and key results (OKRs).',
            enabled: true,
            status: 'beta',
            public: false,
            category: 'vision',
            colorClass: 'from-amber-500 to-orange-600',
            iconBgClass: 'bg-amber-600 shadow-amber-500/20'
        },
        {
            id: 'ledger',
            name: 'Finance',
            path: '/ledger',
            icon: 'chart',
            description: 'Financial performance and burn rate.',
            enabled: true,
            status: 'beta',
            public: false,
            category: 'vision',
            colorClass: 'from-slate-500 to-gray-600',
            iconBgClass: 'bg-slate-600 shadow-slate-500/20'
        }
    ])

    // Helper to get only enabled modules
    const activeModules = computed(() => modules.value.filter(m => m.enabled))

    const isModuleEnabled = (id: string) => {
        return modules.value.find(m => m.id === id)?.enabled ?? false
    }

    return {
        modules,
        activeModules,
        isModuleEnabled
    }
}
