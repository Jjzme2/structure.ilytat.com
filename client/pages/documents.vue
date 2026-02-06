<template>
  <div class="min-h-screen space-y-12 pb-20 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1
          class="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600">
          Knowledge Base
        </h1>
        <p class="text-slate-500 font-medium text-sm md:text-base">Internal Documentation</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- New Document Button -->
        <button @click="toggleForm"
          class="group relative w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-white transition-all duration-300 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
          title="New Note">
          <svg v-if="!showForm && !editingNote"
            class="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform duration-300" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
           <svg v-else class="w-6 h-6 text-rose-500 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Upload Toggle Button -->
         <button @click="toggleUpload"
          class="group relative w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-white transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          title="Upload File">
           <svg v-if="!showUpload" class="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
           <svg v-else class="w-6 h-6 text-rose-500 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

         <button @click="fetchDocuments" class="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all" title="Refresh">
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
         </button>
      </div>
    </div>

    <!-- Toggleable Upload Section -->
     <Transition name="slide-up">
        <div v-if="showUpload" class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div class="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
                <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg class="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Documents
                </h2>
                <UiDocumentUpload />
            </div>
        </div>
    </Transition>

    <!-- Add/Edit Form -->
    <Transition name="slide-up">
      <div v-if="showForm || editingNote" class="relative group">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000">
        </div>
        <div class="relative bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-4">
              <input type="text" v-model="form.title"
                class="block w-full rounded-2xl bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-pink-500 focus:ring-pink-500/20 text-2xl font-bold p-5 transition-all outline-none"
                placeholder="Subject Line" required />
              <textarea v-model="form.content" rows="8"
                class="block w-full rounded-2xl bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-pink-500 focus:ring-pink-500/20 p-5 resize-none transition-all font-mono text-sm leading-relaxed outline-none"
                placeholder="Enter document content..." required></textarea>
            </div>
            <div class="flex justify-end">
              <button type="submit" :disabled="submitting || !form.title.trim()"
                class="relative group/btn overflow-hidden px-10 py-4 rounded-2xl bg-pink-600 text-white font-black shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                <span class="relative z-10">
                  {{ editingNote ? 'Update Document' : 'Save Document' }}
                </span>
                <div
                  class="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300">
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Content Area (Full Width) -->
    <div class="space-y-12">
        <div v-if="loadingDocs" class="text-center py-12 text-slate-500">Loading documents...</div>
        
        <!-- Document Categories -->
        <template v-else>
            <div v-for="(files, category) in categorizedDocuments" :key="category" class="space-y-4">
                <h3 class="text-lg font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                    {{ category === 'Unsorted' ? '📂 General Files' : `📂 ${category}` }}
                    <span class="text-xs font-normal text-slate-600 bg-slate-900 px-2 py-0.5 rounded-full">{{ files.length }}</span>
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="doc in files" :key="doc.key" class="group relative bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-pink-500/30 transition-all hover:shadow-lg hover:shadow-pink-500/5">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-3 overflow-hidden">
                                <span class="text-3xl">📄</span>
                                <div class="flex flex-col min-w-0">
                                <span class="text-sm font-bold text-slate-200 truncate pr-2" :title="doc.filename">{{ doc.filename }}</span>
                                <span class="text-xs text-slate-500">{{ formatBytes(doc.size) }}</span>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <a :href="getPreviewUrl(doc.key)" target="_blank" class="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors" title="View Document">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </a>
                                <a :href="getDownloadUrl(doc.key)" target="_blank" class="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors" title="Download">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div class="mt-2 pt-2 border-t border-slate-800/50 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-wider">
                        <span>{{ new Date(doc.lastModified).toLocaleDateString() }}</span>
                        </div>
                    </div>
                </div>
            </div>

             <div v-if="Object.keys(categorizedDocuments).length === 0 && documents.length === 0" class="text-center py-12 bg-slate-800/20 rounded-2xl border border-dashed border-slate-800">
                <span class="text-slate-500">No files uploaded.</span>
            </div>
        </template>

        <!-- Notes Section -->
        <div class="pt-8">
            <h3 class="text-lg font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                📝 Notes
                <span class="text-xs font-normal text-slate-600 bg-slate-900 px-2 py-0.5 rounded-full">{{ notes.length }}</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div v-for="note in notes" :key="note.id" class="group relative h-64">
                     <div class="absolute -inset-0.5 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/20 group-hover:to-purple-500/20 rounded-2xl transition-all duration-500 blur-sm"></div>
                     <div class="relative flex flex-col h-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-500 overflow-hidden">
                         
                         <div class="flex justify-between items-start mb-2">
                             <h4 class="text-lg font-bold text-slate-200 line-clamp-1 group-hover:text-pink-400 transition-colors">{{ note.title }}</h4>
                             <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button @click="startEdit(note)" class="p-1 text-slate-500 hover:text-emerald-400">✏️</button>
                                <button @click="deleteNote(note.id)" class="p-1 text-slate-500 hover:text-rose-400">🗑️</button>
                             </div>
                         </div>
                         
                         <p class="text-slate-400 text-xs whitespace-pre-wrap line-clamp-6 flex-grow font-mono leading-relaxed">
                             {{ note.content }}
                         </p>

                         <div class="mt-4 flex items-center justify-between text-[10px] text-slate-600 font-mono uppercase">
                             <span>{{ formatDate(note.createdAt) }}</span>
                         </div>
                     </div>
                </div>
                
                 <div v-if="notes.length === 0" class="flex flex-col items-center justify-center p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 text-slate-500">
                    <span class="text-2xl mb-2">📝</span>
                    <span>No notes created.</span>
                </div>
            </div>
        </div>
    </div>


    <div v-if="notes.length === 0 && Object.keys(categorizedDocuments).length === 0" class="text-center py-24 group">
      <div
        class="inline-flex h-24 w-24 items-center justify-center rounded-full bg-slate-800/30 border border-slate-700 group-hover:border-pink-500/50 transition-all duration-500 mb-8">
        <svg class="w-10 h-10 text-slate-600 group-hover:text-pink-500 transition-colors" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p class="text-2xl font-bold text-slate-500">No notes found.</p>
      <p class="text-slate-600 mt-2">Create a new note to get started.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/stores/notes'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import { collection, query, where, orderBy } from 'firebase/firestore'
import type { Note } from '~/types'
import { useR2, type R2File } from '~/composables/useR2'

const user = useCurrentUser()
const db = useFirestore()
const store = useNotesStore()
const { documents, loadingDocs, fetchDocuments, getDownloadUrl, getPreviewUrl } = useR2()

onMounted(() => {
  fetchDocuments()
})

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const showForm = ref(false)
const showUpload = ref(false)
const editingNote = ref<Note | null>(null)
const submitting = ref(false)

const form = reactive({
  title: '',
  content: ''
})

const toggleUpload = () => {
    showUpload.value = !showUpload.value
    if (showUpload.value) showForm.value = false
}

const notesQuery = computed(() => {
  if (!user.value) return null
  return query(
    collection(db, 'notes'),
    where('userId', '==', user.value.uid),
    orderBy('createdAt', 'desc')
  )
})

const notes = useCollection<Note>(notesQuery)

// Group documents by folder
const categorizedDocuments = computed(() => {
    const groups: Record<string, R2File[]> = {}
    
    // Default group
    groups['Unsorted'] = []

    documents.value.forEach(doc => {
        // Only split if "key" has directory structure like "folder/filename.ext"
        // But remember our useR2 stripped the timestamp prefix from 'filename', but 'key' is still full
        // The standard key format we use is "documents/<timestamp>-<filename>"
        // If user manually uploads to PAPERWORK/file.pdf, key is "PAPERWORK/file.pdf"
        
        // Let's assume standard uploads go to 'Unsorted' (technically they are in documents/ folder in bucket, 
        // but we treat that as root for this view if we want).
        
        // However, the user said they have folders: paperwork, registration, templates.
        // So we look for those prefixes in the KEY.
        
        const parts = doc.key.split('/')
        const rootFolder = parts[0] // Safely access first part
        
        if (parts.length > 1 && rootFolder && rootFolder !== 'documents') {
            const folder = rootFolder.charAt(0).toUpperCase() + rootFolder.slice(1) // Capitalize
            if (!groups[folder]) groups[folder] = []
            groups[folder].push(doc)
        } else {
            // standard uploads or root files
            groups['Unsorted'].push(doc)
        }
    })

    // Remove Unsorted if empty and other groups exist (optional, but keeps it clean)
    // if (groups['Unsorted'].length === 0 && Object.keys(groups).length > 1) {
    //     delete groups['Unsorted']
    // }

    return groups
})

const toggleForm = () => {
  if (editingNote.value) {
    editingNote.value = null
    form.title = ''
    form.content = ''
  } else {
    showForm.value = !showForm.value
    if (showForm.value) showUpload.value = false
  }
}

const startEdit = (note: Note) => {
  editingNote.value = note
  form.title = note.title
  form.content = note.content
  showForm.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSubmit = async () => {
  if (!form.title.trim()) return
  submitting.value = true
  try {
    if (editingNote.value) {
      await store.updateNote(editingNote.value.id, {
        title: form.title,
        content: form.content
      })
      editingNote.value = null
    } else {
      await store.addNote(form.title, form.content)
    }
    form.title = ''
    form.content = ''
    showForm.value = false
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}

const deleteNote = async (id: string) => {
  // If we wanted to make this reusable for R2 deletion later, we could.
  if (confirm('Are you sure you want to delete this note?')) {
    await store.deleteNote(id)
  }
}

const formatDate = (ts: any) => {
  if (!ts) return 'Unknown Time'
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
</style>
