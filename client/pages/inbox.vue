<template>
    <div class="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 pt-24 md:pt-32">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-3xl md:text-4xl font-black text-white mb-2 font-display">Inbox</h1>
                <p class="text-slate-400">Manage your messages and notifications.</p>
            </div>
            <div class="flex gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <button
                    @click="activeTab = 'inbox'"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                    :class="activeTab === 'inbox' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'"
                >
                    Inbox
                    <span v-if="unreadCount > 0" class="ml-2 px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px]">
                        {{ unreadCount }}
                    </span>
                </button>
                <button
                    @click="activeTab = 'archived'"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                    :class="activeTab === 'archived' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'"
                >
                    Archived
                </button>
            </div>
        </div>

        <!-- Messages List -->
        <div v-if="filteredMessages.length > 0" class="space-y-4">
             <div v-for="msg in filteredMessages" :key="msg.id"
                class="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl p-6 transition-all"
                :class="{ 'border-l-4 border-l-indigo-500 bg-slate-800/80': !msg.read && activeTab === 'inbox' }">

                <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                            {{ msg.from.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-white">{{ msg.from }}</span>
                                <span v-if="!msg.read && activeTab === 'inbox'" class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            </div>
                            <span class="text-xs text-slate-500">{{ formatDate(msg.timestamp) }}</span>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button @click="handleReply(msg)"
                            class="px-3 py-1.5 rounded-lg bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-600 active:scale-95 transition-all shadow-lg shadow-indigo-500/20">
                            Reply
                        </button>
                        <button v-if="!msg.read && activeTab === 'inbox'" @click="markRead(msg.id)"
                            class="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs uppercase tracking-wider hover:bg-indigo-500/20 active:scale-95 transition-all">
                            Mark Read
                        </button>
                        <button @click="toggleArchive(msg)"
                            class="px-3 py-1.5 rounded-lg bg-slate-700/30 text-slate-400 font-bold text-xs uppercase tracking-wider hover:bg-rose-500/10 hover:text-rose-400 active:scale-95 transition-all">
                            {{ activeTab === 'inbox' ? 'Archive' : 'Unarchive' }}
                        </button>
                    </div>
                </div>

                <h3 class="text-lg font-bold text-white mb-2" :class="{ 'text-indigo-300': !msg.read && activeTab === 'inbox' }">{{ msg.subject }}</h3>
                <p class="text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">{{ msg.body }}</p>

                <!-- Attachments Grid -->
                 <div v-if="msg.attachments && msg.attachments.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="(att, idx) in msg.attachments" :key="idx" 
                        class="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all group/att">
                        
                        <div class="p-2 rounded-lg" :class="{
                            'bg-indigo-500/20 text-indigo-400': att.type === 'task',
                            'bg-emerald-500/20 text-emerald-400': att.type === 'link',
                            'bg-sky-500/20 text-sky-400': att.type === 'document',
                            'bg-rose-500/20 text-rose-400': att.type === 'transaction',
                            'bg-amber-500/20 text-amber-500': att.type === 'event'
                        }">
                             <svg v-if="att.type === 'link'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                             <svg v-else-if="att.type === 'task'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                             <svg v-else-if="att.type === 'document'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                             <svg v-else-if="att.type === 'transaction'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <svg v-else-if="att.type === 'event'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>

                        <div class="min-w-0 flex-1">
                            <div class="flex items-center justify-between mb-0.5">
                                <span class="text-[10px] uppercase font-bold tracking-wider opacity-60">{{ att.type }}</span>
                                <span v-if="att.amount" :class="att.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'" class="text-xs font-mono font-bold">
                                    {{ att.amount >= 0 ? '+' : '-' }}${{ Math.abs(att.amount).toFixed(2) }}
                                </span>
                                <span v-if="att.date" class="text-xs text-slate-400">
                                    {{ new Date(att.date).toLocaleDateString() }}
                                </span>
                            </div>
                            
                            <a v-if="att.type === 'link'" :href="att.url" target="_blank" class="text-sm font-medium text-white group-hover/att:text-indigo-400 truncate block transition-colors">
                                {{ att.title }}
                            </a>
                            <NuxtLink v-else-if="att.type === 'task'" :to="`/tasks/${att.id}`" class="text-sm font-medium text-white group-hover/att:text-indigo-400 truncate block transition-colors">
                                {{ att.title }}
                            </NuxtLink>
                            <button v-else-if="att.type === 'document'" @click="handleDocumentClick(att.key)" class="text-sm font-medium text-white group-hover/att:text-indigo-400 truncate block text-left transition-colors w-full">
                                {{ att.title }}
                            </button>
                             <span v-else class="text-sm font-medium text-white truncate block">
                                {{ att.title }}
                            </span>
                        </div>
                    </div>
                 </div>

            </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700">
                <span class="text-4xl">
                    {{ activeTab === 'inbox' ? '📭' : '📦' }}
                </span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">
                {{ activeTab === 'inbox' ? 'All caught up!' : 'Archive is empty' }}
            </h3>
            <p class="text-slate-400">
                {{ activeTab === 'inbox' ? 'You have no new messages in your inbox.' : 'You haven\'t archived any messages yet.' }}
            </p>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useInbox } from '~/composables/useInbox'
import { useMessageModal } from '~/composables/useMessageModal'
import { useToast } from '~/composables/useToast'
import { useR2 } from '~/composables/useR2'
import type { InboxItem, UserProfile } from '~/types'
import { collection, query, where, orderBy, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'

const user = useCurrentUser()
const db = useFirestore()
const { markRead, init: initInbox, unreadCount } = useInbox()
const { getDownloadUrl } = useR2()
const { open: openMessageModal } = useMessageModal()
const { error } = useToast()

const activeTab = ref<'inbox' | 'archived'>('inbox')
const messages = ref<InboxItem[]>([])

const filteredMessages = computed(() => {
    return messages.value.filter(m => activeTab.value === 'inbox' ? !m.archived : m.archived)
})

// Custom Listener for Full Inbox (Active + Archived)
let unsubscribe: (() => void) | null = null

const initMessages = () => {
    if (!user.value) return

    const q = query(
        collection(db, `users/${user.value.uid}/inbox`),
        orderBy('timestamp', 'desc')
    )

    unsubscribe = onSnapshot(q, (snapshot) => {
        messages.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as InboxItem))
    })
}

// Watchers
watch(user, (u) => {
    if (u) {
        initMessages()
        initInbox() // Ensure main inbox listener is also active for bell count
    }
}, { immediate: true })

onUnmounted(() => {
    if (unsubscribe) unsubscribe()
})

const handleReply = (msg: InboxItem) => {
    if (!msg.fromId) {
        error('Cannot reply: Original sender ID not found (message predates this feature).', 3000)
        return
    }

    const recipient = {
        uid: msg.fromId,
        displayName: msg.from,
        email: null,
        createdAt: new Date()
    } as UserProfile

    const subject = msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`
    openMessageModal(recipient, subject)
}

const toggleArchive = async (msg: InboxItem) => {
    if (!user.value) return
    const docRef = doc(db, `users/${user.value.uid}/inbox`, msg.id)
    await updateDoc(docRef, { archived: !msg.archived })
}

const handleDocumentClick = async (key?: string) => {
  if (!key) return
  const url = await getDownloadUrl(key)
  if (url) {
    window.open(url, '_blank')
  }
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  })
}
</script>
