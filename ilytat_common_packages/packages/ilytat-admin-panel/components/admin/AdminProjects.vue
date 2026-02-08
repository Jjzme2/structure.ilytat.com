<script setup lang="ts">
import { collection, query, orderBy } from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'
import { useProjectsStore } from '~/stores/projects'
import type { Project } from '~/types'

const db = useFirestore()
const projectsStore = useProjectsStore()
const { collectionPath } = projectsStore
const { success, error } = useToast()

// Projects Collection (Reactive)
const projectsQuery = query(collection(db, collectionPath), orderBy('createdAt', 'desc'))
const { data: projects, pending } = useCollection(projectsQuery)

const showAddModal = ref(false)
const editingProject = ref<Project | null>(null)
const loading = ref(false)

const form = reactive({
    name: '',
    description: '',
    status: 'active' as Project['status']
})

const resetForm = () => {
    form.name = ''
    form.description = ''
    form.status = 'active'
    editingProject.value = null
}

const openAddModal = () => {
    resetForm()
    showAddModal.value = true
}

const openEditModal = (project: Project) => {
    editingProject.value = project
    form.name = project.name
    form.description = project.description || ''
    form.status = project.status
    showAddModal.value = true
}

const saveProject = async () => {
    if (!form.name) return
    loading.value = true
    try {
        if (editingProject.value) {
            await projectsStore.updateProject(editingProject.value.id, {
                name: form.name,
                description: form.description,
                status: form.status
            })
            success('Project updated successfully')
        } else {
            await projectsStore.addProject(form.name, form.description)
            success('Project created successfully')
        }
        showAddModal.value = false
        resetForm()
    } catch (e: any) {
        console.error(e)
        error(`Failed to save project: ${e.message}`)
    } finally {
        loading.value = false
    }
}

const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
        await projectsStore.deleteProject(id)
        success('Project deleted')
    } catch (e: any) {
        error(`Failed to delete project: ${e.message}`)
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        case 'on-hold': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        case 'completed': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        case 'archived': return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
}

const formatDate = (date: any) => {
    if (!date) return '...'
    const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date)
    return d.toLocaleDateString()
}
</script>

<template>
    <div class="space-y-8 animate-fade-in">
        <!-- Header Actions -->
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-amber-500 uppercase tracking-widest">Active Projects</h2>
            <button @click="openAddModal"
                class="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95">
                <span>➕</span>
                New Project
            </button>
        </div>

        <!-- Projects Grid -->
        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            <div v-for="i in 3" :key="i" class="h-48 bg-slate-800/50 rounded-2xl border border-slate-700/50"></div>
        </div>

        <div v-else-if="projects?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="project in projects" :key="project.id"
                class="group flex flex-col bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/40 transition-all duration-300">
                <div class="flex justify-between items-start mb-4">
                    <span :class="getStatusColor(project.status)"
                        class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border">
                        {{ project.status }}
                    </span>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button @click="openEditModal(project as any)"
                            class="text-slate-400 hover:text-amber-500 transition-colors">
                            ✏️
                        </button>
                        <button @click="deleteProject(project.id)"
                            class="text-slate-400 hover:text-rose-500 transition-colors">
                            🗑️
                        </button>
                    </div>
                </div>

                <h3 class="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {{ project.name }}
                </h3>
                <p class="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {{ project.description || 'No description provided.' }}
                </p>

                <div
                    class="pt-4 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                    <span>{{ formatDate(project.createdAt) }}</span>
                    <span>{{ project.members?.length || 1 }} Active Members</span>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
            <div class="text-4xl mb-4 opacity-50">📁</div>
            <h2 class="text-xl font-bold text-slate-300">No projects yet</h2>
            <p class="text-slate-500 mb-6 font-mono text-xs uppercase">Operational matrix is currently empty.</p>
            <button @click="openAddModal"
                class="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-amber-500 font-bold rounded-xl transition-all">
                Initiate Project
            </button>
        </div>

        <!-- Add/Edit Modal (Tailored to HQ Console) -->
        <Teleport to="body">
            <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" @click="showAddModal = false"></div>

                <div
                    class="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
                    <div class="p-8">
                        <div class="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                            <h2 class="text-xl font-black text-amber-500 uppercase tracking-tighter">
                                {{ editingProject ? 'Update Module' : 'System Initiation' }}
                            </h2>
                            <button @click="showAddModal = false"
                                class="text-slate-400 hover:text-white transition-colors">
                                ✕
                            </button>
                        </div>

                        <form @submit.prevent="saveProject" class="space-y-6">
                            <div class="space-y-2">
                                <label
                                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project
                                    Name</label>
                                <input v-model="form.name" type="text" required
                                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all font-bold"
                                    placeholder="Enter Project Name..." />
                            </div>

                            <div class="space-y-2">
                                <label
                                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                                <textarea v-model="form.description" rows="3"
                                    class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:border-amber-500 outline-none transition-all resize-none text-sm"
                                    placeholder="Define strategic objectives..."></textarea>
                            </div>

                            <div class="space-y-2">
                                <label
                                    class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global
                                    Status</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <button v-for="status in (['active', 'on-hold', 'completed', 'archived'] as const)"
                                        :key="status" type="button" @click="form.status = status"
                                        :class="form.status === status ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'"
                                        class="px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all">
                                        {{ status }}
                                    </button>
                                </div>
                            </div>

                            <div class="pt-6">
                                <button type="submit" :disabled="loading || !form.name"
                                    class="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20">
                                    {{ loading ? 'Processing...' : (editingProject ? 'Sync Module' : 'Initialize Project') }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>
