<script setup lang="ts">
import { useTenant } from '~/composables/useTenant'

const { scope } = useTenant()

const toggleScope = () => {
  scope.value = scope.value === 'company' ? 'personal' : 'company'
}
</script>

<template>
  <button @click="toggleScope"
    class="relative group flex items-center gap-3 px-1 py-1 rounded-full border transition-all duration-500" :class="scope === 'company'
      ? 'bg-slate-900/80 border-indigo-500/30 hover:border-indigo-400'
      : 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-400'"
    :title="scope === 'company' ? 'Switch to Personal View' : 'Switch to Company View'">
    <!-- Slider Background -->
    <div class="absolute inset-0 rounded-full transition-colors duration-500 opacity-10"
      :class="scope === 'company' ? 'bg-indigo-500' : 'bg-emerald-500'"></div>

    <!-- Toggle Knob (Animated) -->
    <div
      class="absolute top-1 bottom-1 w-[50%] bg-gradient-to-br rounded-full shadow-lg transition-all duration-500 ease-out border border-white/10"
      :class="scope === 'company'
        ? 'left-1 from-indigo-500 to-indigo-600 shadow-indigo-500/20'
        : 'left-[48%] from-emerald-400 to-emerald-600 shadow-emerald-500/20'">
    </div>

    <!-- Labels -->
    <div
      class="relative z-10 flex items-center justify-between w-24 h-7 text-[10px] font-black tracking-widest uppercase select-none">
      <span class="flex-1 text-center transition-colors duration-300"
        :class="scope === 'company' ? 'text-white' : 'text-slate-600'">HQ</span>
      <span class="flex-1 text-center transition-colors duration-300"
        :class="scope === 'personal' ? 'text-white' : 'text-slate-600'">ME</span>
    </div>
  </button>
</template>
