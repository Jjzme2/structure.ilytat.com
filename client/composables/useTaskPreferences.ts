import { ref } from 'vue'

export interface TaskCategory {
    id: string
    label: string
    emoji: string
    color: string
}

const ADMIN_DEFINED_CATEGORIES: TaskCategory[] = [
    { id: 'health', label: 'Health', emoji: '🏃', color: 'bg-emerald-900/50 text-emerald-300' },
    { id: 'career', label: 'Career', emoji: '💼', color: 'bg-blue-900/50 text-blue-300' },
    { id: 'learning', label: 'Learning', emoji: '📚', color: 'bg-purple-900/50 text-purple-300' },
    { id: 'finance', label: 'Finance', emoji: '💰', color: 'bg-amber-900/50 text-amber-300' },
    { id: 'relationships', label: 'Relationships', emoji: '💝', color: 'bg-rose-900/50 text-rose-300' },
    { id: 'creativity', label: 'Creativity', emoji: '🎨', color: 'bg-cyan-900/50 text-cyan-300' },
    { id: 'admin', label: 'Admin', emoji: '🏢', color: 'bg-slate-700 text-slate-300' },
    { id: 'project', label: 'Project', emoji: '🚀', color: 'bg-indigo-900/50 text-indigo-300' }
]

export const useTaskPreferences = () => {
    // Static categories defined by "Admin"
    const categories = ref<TaskCategory[]>([...ADMIN_DEFINED_CATEGORIES])

    // Legacy support refs (no longer used but kept for interface compatibility if needed transiently)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const getCategoryById = (id: string | null | undefined) => {
        if (!id) return null
        return categories.value.find(c => c.id === id) || null
    }

    const addCategory = (cat: Omit<TaskCategory, 'id'>) => {
        const id = cat.label.toLowerCase().replace(/\s+/g, '-')
        categories.value.push({ ...cat, id })
    }

    const updateCategory = (id: string, updates: Partial<TaskCategory>) => {
        const index = categories.value.findIndex(c => c.id === id)
        if (index !== -1) {
            categories.value[index] = { ...categories.value[index], ...updates } as TaskCategory
        }
    }

    const deleteCategory = (id: string) => {
        categories.value = categories.value.filter(c => c.id !== id)
    }

    const resetToDefaults = () => {
        categories.value = [...ADMIN_DEFINED_CATEGORIES]
    }

    return {
        categories,
        loading,
        error,
        getCategoryById,
        DEFAULT_CATEGORIES: ADMIN_DEFINED_CATEGORIES,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefaults
    }
}
