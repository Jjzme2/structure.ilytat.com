<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-end flex-col md:flex-row md:items-stretch items-end"
    role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Panel -->
    <!-- Panel Container -->
    <div
      class="relative w-full h-[85vh] md:h-full md:w-96 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-700 shadow-2xl flex flex-col transform transition-transform rounded-t-2xl md:rounded-none"
      :class="isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'">

      <!-- Heade Dragger (Mobile only) -->
      <div v-if="isMobile" class="w-full flex justify-center pt-3 pb-1">
        <div class="w-12 h-1.5 rounded-full bg-slate-700"></div>
      </div>

      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          Inbox
          <span v-if="unreadCount > 0" class="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">
            {{ unreadCount }} new
          </span>
        </h2>
        <div class="flex items-center gap-2">
          <button v-if="unreadCount > 0" @click="markAllRead"
            class="text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors">
            Mark all read
          </button>
          <button @click="$emit('close')"
            class="p-3 -mr-2 text-slate-400 hover:text-white transition-colors active:scale-90">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-20 md:pb-4">
        <div v-for="msg in inbox" :key="msg.id"
          class="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all"
          :class="{ 'border-l-4 border-l-indigo-500 bg-slate-800/80': !msg.read }">

          <div class="flex justify-between items-start mb-1">
            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">{{ msg.from }}</span>
            <span class="text-xs text-slate-500">{{ formatDate(msg.timestamp) }}</span>
          </div>

          <h3 class="font-medium text-white mb-1" :class="{ 'font-bold': !msg.read }">{{ msg.subject }}</h3>

          <p class="text-sm text-slate-400 leading-relaxed mb-3">{{ msg.body }}</p>

          <!-- Attachments -->
          <div v-if="msg.attachments && msg.attachments.length > 0" class="mb-3 space-y-2">
            <div v-for="(att, idx) in msg.attachments" :key="idx" class="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    :class="{
                        'bg-indigo-500/20 text-indigo-400': att.type === 'task',
                        'bg-emerald-500/20 text-emerald-400': att.type === 'link',
                        'bg-sky-500/20 text-sky-400': att.type === 'document',
                        'bg-rose-500/20 text-rose-400': att.type === 'transaction',
                        'bg-amber-500/20 text-amber-500': att.type === 'event'
                    }">
                    {{ att.type }}
                </span>
                <a v-if="att.type === 'link'" :href="att.url" target="_blank" class="text-sm text-white hover:text-indigo-400 font-medium truncate hover:underline flex-1">
                    {{ att.title }}
                </a>
                <NuxtLink v-else-if="att.type === 'task'" :to="`/tasks/${att.id}`" class="text-sm text-white hover:text-indigo-400 font-medium truncate hover:underline flex-1">
                    {{ att.title }}
                </NuxtLink>
                <button v-else-if="att.type === 'document'" @click="handleDocumentClick(att.key)" class="text-sm text-white hover:text-sky-400 font-medium truncate hover:underline flex-1 text-left">
                    {{ att.title }}
                </button>
                <div v-else-if="att.type === 'transaction'" class="flex-1 flex justify-between items-center text-sm">
                    <span class="text-white font-medium">{{ att.title }}</span>
                    <span class="font-mono" :class="att.amount && att.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                        {{ att.amount && att.amount >= 0 ? '+' : '-' }}${{ Math.abs(att.amount || 0).toFixed(2) }}
                    </span>
                </div>
                <div v-else-if="att.type === 'event'" class="flex-1 flex justify-between items-center text-sm">
                    <span class="text-white font-medium">{{ att.title }}</span>
                    <span class="text-slate-400 text-xs">{{ att.date ? new Date(att.date).toLocaleDateString() : '' }}</span>
                </div>
            </div>
          </div>

          <div
            class="flex items-center justify-end gap-4 mt-3 pt-2 border-t border-slate-700/50 md:mt-0 md:pt-0 md:border-t-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button @click="handleReply(msg)"
              class="px-3 py-1.5 rounded-lg bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-600 active:scale-95 transition-all shadow-lg shadow-indigo-500/20">
              Reply
            </button>
            <button v-if="!msg.read" @click="markRead(msg.id)"
              class="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs uppercase tracking-wider hover:bg-indigo-500/20 active:scale-95 transition-all">
              Mark Read
            </button>
            <button @click="archive(msg.id)"
              class="px-3 py-1.5 rounded-lg bg-slate-700/30 text-slate-400 font-bold text-xs uppercase tracking-wider hover:bg-rose-500/10 hover:text-rose-400 active:scale-95 transition-all">
              Archive
            </button>
          </div>
        </div>

        <div v-if="inbox.length === 0" class="text-center py-12">
          <div class="text-4xl mb-4">📭</div>
          <p class="text-slate-400 font-medium">All caught up!</p>
          <p class="text-slate-600 text-sm mt-1">No new messages.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInbox } from '~/composables/useInbox'
import { useCurrentUser } from 'vuefire'
import { useDevice } from '~/composables/useDevice'
import { useR2 } from '~/composables/useR2'
import { useMessageModal } from '~/composables/useMessageModal'
import { useToast } from '~/composables/useToast'
import type { InboxItem, UserProfile } from '~/types'

const { isMobile } = useDevice()
const user = useCurrentUser()
const { open: openMessageModal } = useMessageModal()
const { error } = useToast()

defineProps<{
  isOpen: boolean
}>()

defineEmits(['close'])

const { inbox, unreadCount, markRead, markAllRead, archive, init } = useInbox()
const { getDownloadUrl } = useR2()

// Initialize inbox when user is available
watch(user, (u) => {
  if (u) init()
}, { immediate: true })

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

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  // Handle Firestore Timestamp or Date
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // If less than 24 hours, show time
  if (diff < 86400000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString()
}

const handleDocumentClick = async (key?: string) => {
  if (!key) return
  const url = await getDownloadUrl(key)
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
/* No scoped styles needed, mostly utility classes */
</style>
