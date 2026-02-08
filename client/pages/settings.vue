<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
        Settings
      </h1>

      <!-- Tabs -->
      <div class="flex p-1 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800/50">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Profile Tab -->
    <div v-show="activeTab === 'profile'" class="space-y-6 animate-fade-in">
      <!-- Profile Settings -->
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Avatar & Initial Info -->
          <div class="flex flex-col items-center gap-4 shrink-0">
            <div
              class="h-24 w-24 rounded-2xl bg-slate-700 border-2 border-slate-600 flex items-center justify-center overflow-hidden relative group">
              <img v-if="profileForm.photoURL" :src="profileForm.photoURL" class="h-full w-full object-cover" />
              <span v-else class="text-3xl font-bold text-slate-500">{{ profile?.displayName?.charAt(0) ||
                profile?.email?.charAt(0) }}</span>

              <!-- Hover Edit Overlay (future feature) -->
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <span class="text-xs font-bold text-white">Edit</span>
              </div>
            </div>
            <div class="text-center">
              <p class="text-white font-bold">{{ profile?.displayName || 'User' }}</p>
              <p class="text-xs text-slate-500 font-mono">{{ profile?.email }}</p>
            </div>
          </div>

          <!-- Edit Form -->
          <div class="flex-1 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-400">Display Name</label>
                <input v-model="profileForm.displayName" type="text"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="Your Name" />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-400">Photo URL</label>
                <input v-model="profileForm.photoURL" type="url"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:border-indigo-500 outline-none transition-colors font-mono text-xs"
                  placeholder="https://..." />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-400">Autobiography</label>
              <textarea v-model="profileForm.bio" rows="3"
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 focus:border-indigo-500 outline-none transition-colors resize-none"
                placeholder="Tell us a bit about yourself..."></textarea>
              <p class="text-[10px] text-slate-500 text-right">Visible in public directory when signed out.</p>
            </div>

            <div class="pt-2 flex justify-end">
              <button @click="saveProfile" :disabled="saving"
                class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50">
                {{ saving ? 'Saving...' : 'Save Profile' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Info (Verified from profile.vue) -->
      <div class="bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
        <h2 class="text-lg font-bold text-slate-400 mb-4">Account Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <span class="block text-slate-500 text-xs uppercase tracking-wider mb-1">User ID</span>
            <code class="bg-slate-950 px-2 py-1 rounded text-slate-300 font-mono select-all">{{ user?.uid }}</code>
          </div>
          <div>
            <span class="block text-slate-500 text-xs uppercase tracking-wider mb-1">Joined</span>
            <span class="text-slate-300">{{ user?.metadata?.creationTime ? new
              Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown' }}</span>
          </div>
          <div>
            <span class="block text-slate-500 text-xs uppercase tracking-wider mb-1">Tenant ID</span>
            <code
              class="bg-slate-950 px-2 py-1 rounded text-slate-300 font-mono select-all">{{ profile?.tenantId || 'ilytat' }}</code>
          </div>
          <div>
            <span class="block text-slate-500 text-xs uppercase tracking-wider mb-1">Last Login</span>
            <span class="text-slate-300">{{ user?.metadata?.lastSignInTime ? new
              Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Now' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Appearance Tab -->
    <div v-show="activeTab === 'appearance'"
      class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg animate-fade-in">
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
import { useUserProfile } from '~/composables/useUserProfile'
import { useCurrentUser } from 'vuefire'

const route = useRoute()
const router = useRouter()
const user = useCurrentUser()

// Tab Logic
const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'appearance', label: 'Appearance' }
]
const activeTab = ref((route.query.tab as string) || 'profile')

watch(activeTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } })
})

// Profile Logic
const { profile, updateProfile } = useUserProfile()
const profileForm = reactive({
  displayName: '',
  bio: '',
  photoURL: ''
})
const saving = ref(false)

watch(profile, (p) => {
  if (p) {
    profileForm.displayName = p.displayName || ''
    profileForm.bio = p.bio || ''
    profileForm.photoURL = p.photoURL || ''
  }
}, { immediate: true })

const saveProfile = async () => {
  saving.value = true
  try {
    await updateProfile({
      displayName: profileForm.displayName,
      bio: profileForm.bio,
      photoURL: profileForm.photoURL
    })
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

// Theme Logic
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
</style>
