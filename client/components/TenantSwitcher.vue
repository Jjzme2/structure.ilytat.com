<script setup lang="ts">
import { useTenant } from '~/composables/useTenant'

const { scope } = useTenant()

const toggleScope = () => {
  scope.value = scope.value === 'company' ? 'personal' : 'company'
}
</script>

<template>
  <button
    @click="toggleScope"
    class="relative group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-accent-primary/50 transition-all duration-300"
    :title="scope === 'company' ? 'Switch to Personal View' : 'Switch to Company View'"
  >
    <!-- Indicator Dot -->
    <div 
        class="w-2 h-2 rounded-full transition-colors duration-300 shadow-[0_0_10px_currentColor]"
        :class="scope === 'company' ? 'bg-indigo-400 text-indigo-400' : 'bg-emerald-400 text-emerald-400'"
    ></div>

    <!-- Label -->
    <span class="text-xs font-bold uppercase tracking-wider text-muted group-hover:text-text-primary transition-colors">
        {{ scope === 'company' ? 'HQ' : 'ME' }}
    </span>

    <!-- Tooltip (Optional visual cue) -->
    <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {{ scope === 'company' ? 'Company Workspace' : 'Personal Workspace' }}
    </div>
  </button>
</template>
