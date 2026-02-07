<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
        Settings
      </h1>
    </div>

    <!-- Appearance & Themes -->
    <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-semibold text-white font-display">Appearance</h2>
          <p class="text-slate-400 text-sm mt-1">Personalize your HQ with a variety of premium visual styles.</p>
        </div>
        <div class="w-full md:w-64">
          <input v-model="themeSearch" type="text" placeholder="Search themes or colors..."
            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-accent-primary outline-none transition-all" />
        </div>
      </div>

      <div class="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <div v-for="(groupThemes, category) in filteredThemes" :key="category" class="space-y-4">
          <div class="flex items-center gap-4">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">{{ category }}</h3>
            <div class="h-px flex-1 bg-slate-700/50"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button v-for="theme in groupThemes" :key="theme.key" @click="applyTheme(theme.key)"
              class="group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 text-left" :class="currentTheme === theme.key
                ? 'bg-accent-primary/5 border-accent-primary shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.2)]'
                : 'bg-slate-900/50 border-slate-700 hover:border-accent-primary/50 hover:bg-slate-800/50'">
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-sm"
                  :class="currentTheme === theme.key ? 'text-accent-primary' : 'text-slate-300'">
                  {{ theme.name }}
                </span>
                <div v-if="currentTheme === theme.key"
                  class="h-2 w-2 rounded-full bg-accent-primary shadow-[0_0_8px_var(--accent-primary)]"></div>
              </div>
              <p class="text-[10px] text-slate-500 uppercase tracking-tighter">
                {{ theme.category }} Style
              </p>

              <!-- Mini Preview Strip -->
              <div class="flex gap-1 mt-3">
                <div v-for="(color, idx) in theme.colors?.slice(0, 3)" :key="idx"
                  class="h-1.5 rounded-full opacity-60 transition-all group-hover:opacity-100" :class="[
                    idx === 0 ? 'w-6' : 'w-3',
                    // Map common color names to CSS classes or generic background styles
                    color === 'green' || color === 'emerald' || color === 'olive' ? 'bg-emerald-500' :
                      color === 'blue' || color === 'cyan' || color === 'indigo' ? 'bg-blue-500' :
                        color === 'red' || color === 'crimson' || color === 'orange' ? 'bg-rose-500' :
                          color === 'pink' || color === 'purple' || color === 'violet' ? 'bg-purple-500' :
                            color === 'amber' || color === 'yellow' ? 'bg-amber-500' :
                              color === 'black' || color === 'dark' || color === 'void' ? 'bg-slate-900' :
                                color === 'slate' || color === 'grey' || color === 'silver' ? 'bg-slate-400' :
                                  'bg-slate-700'
                  ]"></div>
              </div>
            </button>
          </div>
        </div>

        <div v-if="Object.keys(filteredThemes).length === 0"
          class="py-12 text-center border-2 border-dashed border-slate-700 rounded-3xl">
          <span class="text-slate-500 font-medium">No themes match your search criteria.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { themes, currentTheme, applyTheme } = useTheme()
const themeSearch = ref('')

const filteredThemes = computed(() => {
  const search = themeSearch.value.toLowerCase().trim()
  const groups: Record<string, any[]> = {}

  Object.entries(themes).forEach(([key, theme]: [string, any]) => {
    const matchesName = theme.name.toLowerCase().includes(search)
    const matchesCategory = theme.category.toLowerCase().includes(search)
    const matchesColor = theme.colors?.some((c: string) => c.toLowerCase().includes(search))

    if (!search || matchesName || matchesCategory || matchesColor) {
      const category = theme.category || 'Other'
      if (!groups[category]) groups[category] = []
      groups[category].push({ key, ...theme })
    }
  })
  return groups
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
