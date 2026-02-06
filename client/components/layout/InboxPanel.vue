<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Panel -->
    <div
      class="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col transform transition-transform animate-slide-in">
      
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
          <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>
      </div>

      <!-- Messages List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-for="msg in inbox" :key="msg.id"
          class="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all"
          :class="{ 'border-l-4 border-l-indigo-500 bg-slate-800/80': !msg.read }">
          
          <div class="flex justify-between items-start mb-1">
            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">{{ msg.from }}</span>
            <span class="text-xs text-slate-500">{{ formatDate(msg.timestamp) }}</span>
          </div>
          
          <h3 class="font-medium text-white mb-1" :class="{ 'font-bold': !msg.read }">{{ msg.subject }}</h3>
          
          <p class="text-sm text-slate-400 leading-relaxed mb-3">{{ msg.body }}</p>

          <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
             <button v-if="!msg.read" @click="markRead(msg.id)"
              class="text-xs font-medium text-indigo-400 hover:text-indigo-300">
              Mark Read
            </button>
            <button @click="archive(msg.id)"
              class="text-xs font-medium text-slate-500 hover:text-rose-400">
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

defineProps<{
  isOpen: boolean
}>()

defineEmits(['close'])

const { inbox, unreadCount, markRead, markAllRead, archive } = useInbox()

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
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>
