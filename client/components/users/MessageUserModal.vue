<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <!-- Modal -->
        <div class="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            
            <!-- Header -->
            <div class="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                    <span class="text-indigo-400">Message</span>
                    {{ recipient?.displayName || 'User' }}
                </h3>
                <button @click="$emit('close')" class="text-slate-400 hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                
                <!-- Topic -->
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</label>
                    <input v-model="subject" type="text" 
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="What's this about?" />
                </div>

                <!-- Message -->
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message</label>
                    <textarea v-model="body" rows="5"
                        class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        placeholder="Type your message here..."></textarea>
                </div>

                <!-- Attachments List -->
                <div v-if="attachments.length > 0">
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attachments</label>
                    <div class="space-y-2">
                        <div v-for="(att, index) in attachments" :key="index" 
                            class="flex items-center justify-between bg-slate-800 rounded-lg p-2 border border-slate-700/50 group">
                            <div class="flex items-center gap-2 overflow-hidden">
                                <!-- Type Icon -->
                                <span class="p-1.5 rounded-md text-xs font-bold uppercase"
                                    :class="{
                                        'bg-indigo-500/10 text-indigo-400': att.type === 'task',
                                        'bg-emerald-500/10 text-emerald-400': att.type === 'link',
                                        'bg-sky-500/10 text-sky-400': att.type === 'document',
                                        'bg-rose-500/10 text-rose-400': att.type === 'transaction',
                                        'bg-amber-500/10 text-amber-500': att.type === 'event'
                                    }">
                                    {{ att.type }}
                                </span>
                                <span class="text-sm text-slate-300 truncate">{{ att.title }}</span>
                            </div>
                            <button @click="removeAttachment(index)" class="p-1 text-slate-500 hover:text-rose-400 transition-colors">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Add Attachment Controls -->
                <div class="pt-4 border-t border-slate-700/50">
                     <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Add Attachment</label>
                     
                     <div class="flex gap-2 mb-2">
                         <button @click="attachmentMode = 'link'" 
                            class="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all"
                            :class="attachmentMode === 'link' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'">
                            Link
                         </button>
                         <button @click="attachmentMode = 'task'" 
                            class="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all"
                            :class="attachmentMode === 'task' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'">
                            Task
                         </button>
                         <button @click="attachmentMode = 'document'" 
                            class="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all"
                            :class="attachmentMode === 'document' ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'">
                            Document
                         </button>
                         <button @click="attachmentMode = 'finance'" 
                            class="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all"
                            :class="attachmentMode === 'finance' ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'">
                            Finance
                         </button>
                         <button @click="attachmentMode = 'schedule'" 
                            class="flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all"
                            :class="attachmentMode === 'schedule' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'">
                            Schedule
                         </button>
                     </div>

                     <!-- Link Input -->
                     <div v-if="attachmentMode === 'link'" class="space-y-2 animate-ilytat-fade-in">
                         <input v-model="linkTitle" type="text" placeholder="Link Title" class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                         <div class="flex gap-2">
                             <input v-model="linkUrl" type="text" placeholder="https://" class="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                             <button @click="addLink" :disabled="!linkTitle || !linkUrl" 
                                class="px-4 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold">Add</button>
                         </div>
                     </div>

                     <!-- Task Selector -->

                     <div v-if="attachmentMode === 'task'" class="space-y-2 animate-ilytat-fade-in">
                         <div v-if="loadingTasks" class="text-center py-4 text-slate-500 text-sm">Loading tasks...</div>
                         <div v-else class="max-h-32 overflow-y-auto custom-scrollbar border border-slate-700 rounded-lg bg-slate-800/30">
                             <button v-for="task in tasks" :key="task.id" @click="addTask(task)"
                                class="w-full text-left px-3 py-2 hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                                <span class="text-sm text-slate-300 truncate">{{ task.title }}</span>
                                <span class="text-[10px] text-slate-500 uppercase">{{ task.status }}</span>
                             </button>
                             <div v-if="tasks.length === 0" class="p-3 text-center text-slate-500 text-xs">No tasks found</div>
                         </div>
                     </div>

                     <!-- Document Selector -->
                     <div v-if="attachmentMode === 'document'" class="space-y-2 animate-ilytat-fade-in">
                        <input v-model="documentSearch" type="text" placeholder="Search documents..." class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 mb-2" />
                        
                        <div v-if="loadingDocs" class="text-center py-4 text-slate-500 text-sm">Loading documents...</div>
                        <div v-else class="max-h-32 overflow-y-auto custom-scrollbar border border-slate-700 rounded-lg bg-slate-800/30">
                            <button v-for="doc in filteredDocuments" :key="doc.key" @click="addDocument(doc)"
                                class="w-full text-left px-3 py-2 hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                                <span class="text-sm text-slate-300 truncate">{{ doc.filename }}</span>
                                <span class="text-[10px] text-slate-500">{{ (doc.size / 1024).toFixed(0) }} KB</span>
                            </button>
                            <div v-if="filteredDocuments.length === 0" class="p-3 text-center text-slate-500 text-xs">No documents found</div>
                        </div>
                     </div>

                     <!-- Finance Selector -->
                     <div v-if="attachmentMode === 'finance'" class="space-y-2 animate-ilytat-fade-in">
                        <div v-if="!financeStore.transactions" class="text-center py-4 text-slate-500 text-sm">Loading transactions...</div>
                        <div v-else class="max-h-32 overflow-y-auto custom-scrollbar border border-slate-700 rounded-lg bg-slate-800/30">
                            <button v-for="t in financeStore.transactions.slice(0, 20)" :key="t.id" @click="addTransaction(t)"
                                class="w-full text-left px-3 py-2 hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                                <span class="text-sm text-slate-300 truncate">{{ t.description }}</span>
                                <span class="text-xs font-mono" :class="t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'">
                                    {{ t.type === 'income' ? '+' : '-' }}${{ t.amount.toFixed(2) }}
                                </span>
                            </button>
                            <div v-if="financeStore.transactions.length === 0" class="p-3 text-center text-slate-500 text-xs">No transactions found</div>
                        </div>
                     </div>

                     <!-- Schedule Selector -->
                     <div v-if="attachmentMode === 'schedule'" class="space-y-2 animate-ilytat-fade-in">
                        <div v-if="loadingDates" class="text-center py-4 text-slate-500 text-sm">Loading dates...</div>
                        <div v-else class="max-h-32 overflow-y-auto custom-scrollbar border border-slate-700 rounded-lg bg-slate-800/30">
                            <button v-for="d in dates" :key="d.id" @click="addEvent(d)"
                                class="w-full text-left px-3 py-2 hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                                <span class="text-sm text-slate-300 truncate">{{ d.title }}</span>
                                <span class="text-[10px] text-slate-500">{{ new Date(d.date).toLocaleDateString() }}</span>
                            </button>
                            <div v-if="!dates || dates.length === 0" class="p-3 text-center text-slate-500 text-xs">No dates found</div>
                        </div>
                     </div>
                </div>

            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
                <button @click="$emit('close')" class="px-4 py-2 rounded-xl text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
                <button @click="handleSend" :disabled="sending || !subject || !body"
                    class="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
                    <span v-if="sending" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                    <span>{{ sending ? 'Sending...' : 'Send Message' }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useInbox } from '~/composables/useInbox'
import { useR2, type R2File } from '~/composables/useR2'
import { useFinanceStore } from '~/stores/finance'
import { useCurrentUser, useCollection, useFirestore } from 'vuefire'
import { collection, query, where, orderBy, limit } from 'firebase/firestore'
import type { UserProfile, Task, Transaction, ImportantDate } from '~/types'

const props = defineProps<{
    isOpen: boolean
    recipient: UserProfile | null
    initialSubject?: string
}>()

const emit = defineEmits(['close', 'sent'])

const { send } = useInbox()
const { documents, fetchDocuments, loadingDocs } = useR2()
const financeStore = useFinanceStore()
const user = useCurrentUser()
const db = useFirestore()

// Form State
const subject = ref('')
const body = ref('')
const attachments = ref<{ 
    type: 'task' | 'note' | 'link' | 'document' | 'transaction' | 'event', 
    id?: string, 
    title: string, 
    url?: string, 
    key?: string,
    amount?: number,
    date?: string
}[]>([])
const sending = ref(false)

// Attachment UI State
const attachmentMode = ref<'link' | 'task' | 'document' | 'finance' | 'schedule' | 'none'>('none')
const linkTitle = ref('')
const linkUrl = ref('')

// Load Tasks for attachment
const tasksQuery = computed(() => {
    if (!user.value || !props.isOpen || attachmentMode.value !== 'task') return null
    return query(
        collection(db, 'tasks'),
        where('userId', '==', user.value.uid),
        limit(20) // Just recent ones for now
    )
})
const { data: tasks, pending: loadingTasks } = useCollection<Task>(tasksQuery)

// Load Dates for attachment
const datesQuery = computed(() => {
    if (!user.value || !props.isOpen || attachmentMode.value !== 'schedule') return null
    return query(
        collection(db, 'dates'),
        where('userId', '==', user.value.uid),
        orderBy('date', 'asc'), 
        // We could filter for future dates, but maybe they want to attach past events too?
        limit(20)
    )
})
const { data: dates, pending: loadingDates } = useCollection<ImportantDate>(datesQuery)


// Document Search
const documentSearch = ref('')
const filteredDocuments = computed(() => {
    if (!documentSearch.value) return documents.value
    const q = documentSearch.value.toLowerCase()
    return documents.value.filter(d => d.filename.toLowerCase().includes(q))
})

// Fetch docs when mode changes
watch(attachmentMode, (newMode) => {
    if (newMode === 'document' && documents.value.length === 0) {
        fetchDocuments()
    }
})

// Reset form when opened
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        subject.value = props.initialSubject || ''
        body.value = ''
        attachments.value = []
        attachmentMode.value = 'none'
        linkTitle.value = ''
        linkUrl.value = ''
        documentSearch.value = ''
    }
})

const addLink = () => {
    if (!linkTitle.value || !linkUrl.value) return
    attachments.value.push({
        type: 'link',
        title: linkTitle.value,
        url: linkUrl.value
    })
    linkTitle.value = ''
    linkUrl.value = ''
    attachmentMode.value = 'none'
}

const addTask = (task: Task) => {
    attachments.value.push({
        type: 'task',
        id: task.id,
        title: task.title
    })
    attachmentMode.value = 'none'
}

const addDocument = (doc: R2File) => {
    attachments.value.push({
        type: 'document',
        title: doc.filename,
        key: doc.key,
        url: '' // Will be generated on view
    })
    attachmentMode.value = 'none'
}

const addTransaction = (t: Transaction) => {
    attachments.value.push({
        type: 'transaction',
        id: t.id,
        title: t.description,
        amount: t.amount
    })
    attachmentMode.value = 'none'
}

const addEvent = (d: ImportantDate) => {
    attachments.value.push({
        type: 'event',
        id: d.id,
        title: d.title,
        date: d.date
    })
    attachmentMode.value = 'none'
}

const removeAttachment = (index: number) => {
    attachments.value.splice(index, 1)
}

const handleSend = async () => {
    if (!props.recipient?.uid || !user.value) return
    
    sending.value = true
    try {
        await send(props.recipient.uid, {
            subject: subject.value,
            body: body.value,
            from: user.value.displayName || 'User',
            type: 'message',
            priority: 'normal',
            attachments: attachments.value
        })
        emit('sent')
        emit('close')
    } catch (e) {
        console.error('Failed to send message:', e)
        // Ideally show toast error here
    } finally {
        sending.value = false
    }
}
</script>

<style scoped>
.animate-scale-in {
    animation: scaleIn 0.2s ease-out forwards;
}

@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(71, 85, 105, 0.8);
    border-radius: 3px;
}
</style>
