<template>
  <div class="min-h-screen relative overflow-hidden bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30">
    <!-- Hero Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img src="/landing_hero.png" alt="HQ Background"
        class="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom" />
      <div class="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950"></div>
    </div>

    <!-- Grid Background Layer -->
    <div
      class="absolute inset-0 z-1 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none">
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 py-12 min-h-screen flex flex-col">
      <!-- Header -->
      <header v-ilytat-animate="'entrance'" class="flex justify-between items-center mb-16">
        <div class="flex items-center gap-4">
          <div
            class="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <img src="https://media.ilytat.com/logo.png" alt="ILYTAT Logo" class="h-8 w-8" />
          </div>
          <span class="text-xl font-black tracking-[0.3em] uppercase text-white drop-shadow-sm">ILYTAT HQ</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="hidden md:block text-[10px] font-mono text-emerald-500/60 tracking-widest uppercase">
            Node: US-EAST-SECURE
          </div>
          <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
        </div>
      </header>

      <!-- Main Layout -->
      <main class="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <!-- Left Column: Hero & Notice -->
        <div class="lg:col-span-7 space-y-10">
          <div v-ilytat-animate="'entrance'" class="space-y-4">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Public Information Portal
            </div>
            <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
              DIGITAL <br />
              <span
                class="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500">OFFICE</span>
            </h1>
            <p class="text-xl md:text-2xl text-slate-400 font-light max-w-xl leading-relaxed">
              Proprietary command center for asset management, operational intelligence, and strategic growth.
            </p>
          </div>

          <!-- Security Alert Box -->
          <div v-ilytat-animate="'entrance'">
            <div
              class="p-6 rounded-2xl bg-emerald-500/5 border-2 border-emerald-500/20 backdrop-blur-xl group relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg class="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" />
                </svg>
              </div>
              <div class="flex gap-4 items-start">
                <div class="mt-1 p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-1">HQ System Online
                  </h4>
                  <p class="text-sm text-slate-400 leading-relaxed">
                    Welcome to the digital headquarters of <span class="text-white font-semibold">ILYTAT
                      LLC</span>.
                    Explore our public updates and strategic roadmap below. Secure access is required for internal
                    operational modules.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action -->
          <div v-ilytat-animate="'entrance'" class="flex flex-wrap gap-4">
            <NuxtLink to="/login"
              class="group relative px-10 py-5 bg-white text-slate-950 font-black text-lg tracking-widest rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <span class="relative z-10 uppercase">Access Workspace</span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
              </div>
            </NuxtLink>

            <button @click="scrollToUpdates"
              class="px-8 py-5 border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold tracking-widest rounded-xl hover:bg-white/10 transition-colors uppercase text-sm">
              View Intel
            </button>
          </div>
        </div>

        <!-- Right Column: News & Intel -->
        <div v-ilytat-animate="'entrance'" class="lg:col-span-5 space-y-8">

          <!-- News Module -->
          <section id="updates"
            class="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-2xl shadow-2xl">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-white font-black uppercase tracking-widest text-lg flex items-center gap-3">
                <span class="h-1 w-8 bg-emerald-500 rounded-full"></span>
                Strategic Updates
              </h2>
              <span class="text-[10px] font-mono text-slate-500 uppercase">Feed: STABLE</span>
            </div>

            <div class="space-y-6">
              <div v-if="!publicEvents || publicEvents.length === 0"
                class="py-8 text-center text-slate-600 font-mono text-xs uppercase tracking-widest">
                No public updates at this time.
              </div>
              <div v-for="item in publicEvents" :key="item.id"
                class="group border-l-2 border-emerald-500/20 hover:border-emerald-500 pl-4 py-1 transition-colors">
                <div class="text-[10px] font-mono text-emerald-500/60 uppercase mb-1">{{ formatDate(item.date) }}</div>
                <h3 class="text-white font-bold mb-1 group-hover:text-emerald-400 transition-colors">{{ item.title }}
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed">{{ getEventDescription(item) }}</p>
              </div>
            </div>
          </section>

          <!-- Quotes Module -->
          <section class="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-md">
            <div class="flex items-center gap-3 mb-6">
              <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L21.017 3V15C21.017 18.3137 18.3241 21 14.917 21H14.017ZM3.01697 21L3.01697 18C3.01697 16.8954 3.9124 16 5.01697 16H8.01697C8.56925 16 9.01697 15.5523 9.01697 15V9C9.01697 8.44772 8.56925 8 8.01697 8H5.01697C3.9124 8 3.01697 7.10457 3.01697 6V3L10.017 3V15C10.017 18.3137 7.32412 21 3.91697 21H3.01697Z" />
              </svg>
              <h2 class="text-emerald-500 font-bold uppercase tracking-widest text-xs">Public Intelligence</h2>
            </div>
            <div class="relative italic text-slate-300 text-lg font-serif">
              "{{ currentQuote.text }}"
              <div class="mt-3 text-xs font-mono non-italic text-slate-500 uppercase">— {{ currentQuote.author }}</div>
            </div>
          </section>

        </div>
      </main>

      <!-- Footer -->
      <footer
        class="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
        <div class="flex items-center gap-4">
          <span>ILYTAT LLC © 2025 — Present</span>
          <span class="h-1 w-1 rounded-full bg-slate-800"></span>
          <span class="text-slate-700">All Security Protocols Logged</span>
        </div>
        <div class="flex gap-8 mt-4 md:mt-0">
          <NuxtLink to="/coming-soon" class="hover:text-emerald-500 cursor-pointer transition-colors">Privacy</NuxtLink>
          <NuxtLink to="/coming-soon" class="hover:text-emerald-500 cursor-pointer transition-colors">Legal</NuxtLink>
          <NuxtLink to="/coming-soon" class="hover:text-emerald-500 cursor-pointer transition-colors">Compliance
          </NuxtLink>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inspirationalMessages } from '~/config/data'
import type { ImportantDate } from '~/types'

definePageMeta({
  layout: 'empty',
  middleware: 'guest'
})

// Fetch public calendar events
const { data: publicEvents } = useFetch<ImportantDate[]>('/api/dates/public')

const currentQuote = ref({
  text: inspirationalMessages[0],
  author: "System Intelligence"
})

onMounted(() => {
  const randomIdx = Math.floor(Math.random() * inspirationalMessages.length)
  currentQuote.value.text = inspirationalMessages[randomIdx]
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getEventDescription = (item: ImportantDate) => {
  return item.description || 'System generated event update.'
}

const scrollToUpdates = () => {
  document.getElementById('updates')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.animate-slow-zoom {
  animation: slowZoom 30s infinite alternate ease-in-out;
}

@keyframes slowZoom {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.1);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
