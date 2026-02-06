<template>
  <button class="relative group p-2 text-slate-400 hover:text-white transition-colors" title="Inbox">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>

    <!-- Notification Dot -->
    <span v-if="unreadCount > 0"
      class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-900">
      {{ unreadCount > 9 ? '9+' : unreadCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useInbox } from '~/composables/useInbox'

const { unreadCount, init } = useInbox()

onMounted(() => {
  init()
})
</script>
