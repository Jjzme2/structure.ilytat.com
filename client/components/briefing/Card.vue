<script setup lang="ts">
import type { Briefing } from '~/types'

const props = defineProps<{
  briefing: Briefing
}>()

// Helper to format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Confidence color
const confidenceColor = computed(() => {
  if (props.briefing.confidenceScore >= 90) return 'text-emerald-400'
  if (props.briefing.confidenceScore >= 70) return 'text-amber-400'
  return 'text-rose-400'
})
</script>

<template>
  <NuxtLink 
    :to="`/intelligence/${briefing.id}`"
    class="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 block h-full flex flex-col"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <span class="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1 block">
            {{ briefing.source }}
        </span>
        <h3 class="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
            {{ briefing.title }}
        </h3>
      </div>
      
      <!-- Date Badge -->
      <div class="px-2 py-1 rounded bg-slate-800 text-xs font-mono text-slate-400">
        {{ formatDate(briefing.date) }}
      </div>
    </div>

    <!-- TL;DR -->
    <p class="text-sm text-slate-400 line-clamp-3 mb-6 flex-grow">
        {{ briefing.tldr }}
    </p>

    <!-- Footer Meta -->
    <div class="flex items-center justify-between pt-4 border-t border-slate-800">
       <!-- Confidence -->
       <div class="flex items-center gap-2">
           <div class="w-1.5 h-1.5 rounded-full bg-current" :class="confidenceColor"></div>
           <span class="text-xs font-medium text-slate-500">
               Confidence: <span :class="confidenceColor">{{ briefing.confidenceScore }}%</span>
           </span>
       </div>

       <!-- Link Icon -->
       <div class="text-slate-600 group-hover:text-white transition-colors group-hover:translate-x-1 duration-300">
         →
       </div>
    </div>
  </NuxtLink>
</template>
