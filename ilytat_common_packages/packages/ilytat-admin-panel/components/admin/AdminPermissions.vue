<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCurrentUser } from 'vuefire'
import type { TaskGroup } from '../../types/admin'

const groups = ref<TaskGroup[]>([])
const loading = ref(true)
const editing = ref<TaskGroup | null>(null)
const isEditing = ref(false)

const formName = ref('')
const formDesc = ref('')

const fetchGroups = async () => {
    loading.value = true
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()
        const data = await $fetch<TaskGroup[]>('/api/admin/groups', {
            headers: { Authorization: `Bearer ${token}` }
        })
        groups.value = data
    } catch (e: any) {
        console.error('Failed to load groups', e)
    } finally {
        loading.value = false
    }
}

const openEditor = (group?: TaskGroup) => {
    if (group) {
        editing.value = group
        formName.value = group.name
        formDesc.value = group.description
    } else {
        editing.value = null
        formName.value = ''
        formDesc.value = ''
    }
    isEditing.value = true
}

const saveGroup = async () => {
    if (!formName.value) return
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()

        await $fetch('/api/admin/groups', {
            method: 'POST',
            body: {
                id: editing.value?.id,
                name: formName.value,
                description: formDesc.value
            },
            headers: { Authorization: `Bearer ${token}` }
        })

        isEditing.value = false
        fetchGroups()
    } catch (e: any) {
        console.error('Failed to save group', e)
    }
}

const deleteGroup = async (id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return
    try {
        const user = await getCurrentUser()
        const token = await user?.getIdToken()

        await $fetch('/api/admin/groups', {
            method: 'DELETE',
            body: { id },
            headers: { Authorization: `Bearer ${token}` }
        })
        fetchGroups()
    } catch (e: any) {
        console.error('Failed to delete group', e)
    }
}

onMounted(fetchGroups)
</script>

<template>
    <div class="space-y-8 animate-fade-in">
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-amber-500">Resource Permissions</h2>
            <button @click="openEditor()"
                class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-sm">
                + Create Security Group
            </button>
        </div>

        <div v-if="loading" class="text-center py-20 text-slate-500 uppercase tracking-widest text-xs">Scanning
            Groups...</div>
        <div v-else-if="groups.length === 0"
            class="text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-2xl border-dashed">
            <p class="text-slate-500">No security groups defined.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="group in groups" :key="group.id"
                class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/50 transition-colors group relative">
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button @click="openEditor(group)" class="text-slate-400 hover:text-white text-xs">Edit</button>
                    <button @click="deleteGroup(group.id)"
                        class="text-slate-400 hover:text-rose-400 text-xs">Delete</button>
                </div>

                <h3 class="text-lg font-bold text-white mb-2 pr-12">{{ group.name }}</h3>
                <p class="text-xs text-slate-500 line-clamp-2 mb-4">{{ group.description || 'Global Access Group' }}</p>

                <div class="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                    Last Updated: {{ group.updatedAt ? new Date(group.updatedAt).toLocaleDateString() : 'Awaiting sync'
                    }}
                </div>
            </div>
        </div>

        <!-- Editor Modal -->
        <div v-if="isEditing"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                <h2 class="text-xl font-bold text-amber-500 mb-6 uppercase tracking-widest">
                    {{ editing ? 'Modify Group' : 'Initialize Group' }}
                </h2>

                <div class="space-y-4 mb-8">
                    <div>
                        <label
                            class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Identifier</label>
                        <input v-model="formName" type="text"
                            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                            placeholder="e.g. CORE_OPERATIONS" />
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Policy
                            Description</label>
                        <textarea v-model="formDesc" rows="3"
                            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                            placeholder="Describe the scope of this group..."></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-3">
                    <button @click="isEditing = false"
                        class="px-4 py-2 text-slate-400 hover:text-white font-medium text-sm">
                        Abort
                    </button>
                    <button @click="saveGroup"
                        class="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm">
                        Commit Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
