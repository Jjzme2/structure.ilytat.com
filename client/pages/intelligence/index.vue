<script setup lang="ts">
import { useBriefingsStore } from '~/stores/briefings'
import type { Briefing } from '~/types'

const briefingsStore = useBriefingsStore()
const { briefings } = storeToRefs(briefingsStore)

// Initial Fetch? Usually useFirestore handles real-time sync automatically
</script>

<template>
  <div class="space-y-8 animate-fade-in relative z-10 pb-20">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 mb-2">
            Intelligence
        </h1>
        <p class="text-slate-500 font-medium text-sm md:text-base">
            Strategic Briefings & Consulting Memos
        </p>
      </div>

      <NuxtLink 
        to="/intelligence/new" 
        class="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
      >
        <span>+</span> New Briefing
      </NuxtLink>
    </div>

    <!-- Briefings Grid -->
    <div v-if="briefings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BriefingCard 
            v-for="briefing in briefings" 
            :key="briefing.id" 
            :briefing="briefing" 
        />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
        <div class="text-6xl mb-4 opacity-50">🤖</div>
        <h3 class="text-xl font-bold text-white mb-2">No Intelligence Found</h3>
        <p class="text-slate-500 max-w-md mx-auto mb-8">
            Start gathering strategic insights to populate your briefing room.
        </p>
        <NuxtLink 
            to="/intelligence/new" 
            class="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
        >
            Create First Briefing
        </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
