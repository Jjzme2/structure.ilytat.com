<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id"
        :role="toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'"
        :aria-live="toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'"
        class="pointer-events-auto min-w-[300px] max-w-sm w-full bg-slate-800 border border-slate-700 shadow-xl rounded-xl p-4 flex items-start gap-4 transform transition-all duration-300">
        
        <!-- Icons -->
        <span v-if="toast.type === 'success'" aria-hidden="true" class="text-emerald-400 text-xl">✓</span>
        <span v-else-if="toast.type === 'error'" aria-hidden="true" class="text-rose-400 text-xl">✕</span>
        <span v-else-if="toast.type === 'warning'" aria-hidden="true" class="text-amber-400 text-xl">⚠</span>
        <span v-else aria-hidden="true" class="text-blue-400 text-xl">ℹ</span>

        <div class="flex-1">
          <p class="text-sm font-medium text-white">{{ toast.message }}</p>
        </div>

        <button @click="remove(toast.id)" aria-label="Dismiss notification" class="text-slate-500 hover:text-white transition-colors focus-visible:ring-2 focus-visible:outline-none rounded-md">
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
