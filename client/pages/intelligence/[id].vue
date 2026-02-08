<script setup lang="ts">
import { useBriefingsStore } from '~/stores/briefings'
import type { Briefing } from '~/types'
import { marked } from 'marked'

const route = useRoute()
const briefingsStore = useBriefingsStore()
const { briefings } = storeToRefs(briefingsStore)

const briefing = computed(() => 
  briefings.value.find(b => b.id === route.params.id)
)

const compiledMarkdown = computed(() => {
  if (!briefing.value?.content) return ''
  return marked(briefing.value.content)
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Confidence color helper
const confidenceColor = computed(() => {
  const score = briefing.value?.confidenceScore || 0
  if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  if (score >= 70) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
})
</script>

<template>
  <div v-if="briefing" class="max-w-3xl mx-auto pb-20 animate-fade-in relative z-10">
    
    <!-- Navigation Back -->
    <NuxtLink to="/intelligence" class="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group">
      <span class="group-hover:-translate-x-1 transition-transform">←</span> Back to Intelligence
    </NuxtLink>

    <!-- Official Memo Container -->
    <div class="bg-white text-slate-900 rounded-none shadow-2xl overflow-hidden print:shadow-none min-h-[800px] relative">
      
      <!-- Watermark/Background Texture -->
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50 pointer-events-none"></div>
      
      <!-- Header -->
      <div class="p-8 md:p-12 border-b-2 border-slate-900 relative z-10">
        <div class="flex justify-between items-start mb-8">
            <div class="flex items-center gap-3">
                 <img src="https://media.ilytat.com/logo.png" alt="ILYTAT" class="w-10 h-10 filter grayscale contrast-150" />
                 <div>
                     <h1 class="font-display font-black text-2xl tracking-tighter uppercase">ILYTAT HQ</h1>
                     <p class="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500">Official Intelligence Briefing</p>
                 </div>
            </div>
            <div class="text-right">
                <p class="text-sm font-bold font-mono text-slate-400">#{{ briefing.id.slice(0,8).toUpperCase() }}</p>
            </div>
        </div>

        <div class="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 text-sm font-mono">
            <span class="text-slate-500 uppercase tracking-wider">Date:</span>
            <span class="font-bold border-b border-dotted border-slate-400 pb-1">{{ formatDate(briefing.date) }}</span>
            
            <span class="text-slate-500 uppercase tracking-wider">Source:</span>
            <span class="font-bold border-b border-dotted border-slate-400 pb-1">{{ briefing.source }}</span>

            <span class="text-slate-500 uppercase tracking-wider">Subject:</span>
            <span class="font-bold text-lg border-b border-dotted border-slate-400 pb-1 uppercase">{{ briefing.title }}</span>
        </div>
      </div>

      <!-- Confidence Banner -->
      <div class="px-8 md:px-12 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
          <span class="text-slate-400">Analysis Confidence Level</span>
          <span class="px-2 py-0.5 rounded border" :class="confidenceColor">
              {{ briefing.confidenceScore }}% Certainty
          </span>
      </div>

      <!-- Content Body -->
      <div class="p-8 md:p-12 prose prose-slate max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-a:text-indigo-600 relative z-10">
          <!-- TL;DR Box -->
          <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-8 not-prose">
              <h4 class="text-xs font-bold font-mono text-indigo-800 uppercase tracking-wider mb-2">Executive Summary (TL;DR)</h4>
              <p class="text-sm text-indigo-900 leading-relaxed font-medium">{{ briefing.tldr }}</p>
          </div>

          <!-- Markdown Content -->
          <div v-html="compiledMarkdown"></div>
      </div>

      <!-- Footer -->
      <div class="px-8 md:px-12 py-8 border-t border-slate-200 mt-auto bg-slate-50 text-center">
          <p class="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Confidential // Internal Use Only // ILYTAT HQ
          </p>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-20">
      <p class="text-slate-500">Briefing not found.</p>
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
