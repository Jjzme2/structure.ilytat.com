<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
        Settings
      </h1>
      <button @click="testToasts" class="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700">
        Test Toasts
      </button>
    </div>

    <!-- Task Categories -->
    <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg overflow-hidden transition-all duration-500">
      <div 
        @click="isCategoriesExpanded = !isCategoriesExpanded"
        class="flex items-center justify-between cursor-pointer group"
      >
        <div>
          <h2 class="text-xl font-semibold text-white">Task Categories</h2>
          <p v-if="!isCategoriesExpanded" class="text-slate-400 text-sm mt-1">
            {{ categories.length }} categories defined. Click to manage.
          </p>
        </div>
        <div 
          class="p-2 rounded-xl bg-slate-700/50 text-slate-400 group-hover:text-indigo-400 transition-all duration-300"
          :class="isCategoriesExpanded ? 'rotate-180' : ''"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div v-show="isCategoriesExpanded" class="mt-6 space-y-6 animate-fade-in">
        <p class="text-slate-400 text-sm">
          Customize the categories available for your tasks. These help you track growth across different life areas.
        </p>

        <!-- Category List -->
        <div class="space-y-3">
          <div v-for="cat in categories" :key="cat.id"
            class="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-700 rounded-xl group">
            <span class="text-2xl">{{ cat.emoji }}</span>
            <div class="flex-1">
              <span class="font-medium text-white">{{ cat.label }}</span>
              <span class="ml-2 px-2 py-0.5 rounded-full text-xs" :class="cat.color">{{ cat.id }}</span>
            </div>
            <button @click="editCategory(cat)"
              class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-indigo-400 transition-all">
              ✏️
            </button>
            <button @click="removeCategory(cat.id)"
              class="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-400 transition-all">
              🗑️
            </button>
          </div>
        </div>

        <!-- Add/Edit Category Form -->
        <div class="border-t border-slate-700 pt-6">
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input v-model="categoryForm.label" type="text" placeholder="Label (e.g. Fitness)"
              class="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 outline-none" />
            <input v-model="categoryForm.emoji" type="text" placeholder="Emoji (e.g. 🏋️)"
              class="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 outline-none" />
            <select v-model="categoryForm.color"
              class="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none">
              <option value="bg-emerald-900/50 text-emerald-300">Green</option>
              <option value="bg-blue-900/50 text-blue-300">Blue</option>
              <option value="bg-purple-900/50 text-purple-300">Purple</option>
              <option value="bg-amber-900/50 text-amber-300">Amber</option>
              <option value="bg-rose-900/50 text-rose-300">Rose</option>
              <option value="bg-cyan-900/50 text-cyan-300">Cyan</option>
              <option value="bg-orange-900/50 text-orange-300">Orange</option>
              <option value="bg-pink-900/50 text-pink-300">Pink</option>
              <option value="bg-teal-900/50 text-teal-300">Teal</option>
            </select>
            <div class="flex gap-2">
              <button @click="saveCategory" :disabled="!categoryForm.label || !categoryForm.emoji || prefsLoading"
                class="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50">
                {{ editingCategory ? 'Update' : 'Add' }}
              </button>
              <button v-if="editingCategory" @click="cancelEdit"
                class="py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Reset Button -->
        <div class="pt-6 border-t border-slate-700">
          <button @click="resetCategories" class="text-sm text-slate-500 hover:text-rose-400 transition-colors">
            Reset to default categories
          </button>
        </div>
      </div>
    </div>


    <!-- Email Configuration Test -->
    <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
      <h2 class="text-xl font-semibold text-white mb-4">Email Configuration</h2>
      <p class="text-slate-400 text-sm mb-6">
        Test your EmailJS integration. Ensure you have mapped the environment variables correctly in your .env file.
      </p>

      <div class="space-y-4 max-w-md">
        <button @click="testEmail" :disabled="sending"
          class="w-full flex justify-center items-center gap-2 py-3 px-4 border border-indigo-500 rounded-xl text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 focus:outline-none transition-colors disabled:opacity-50">
          <span v-if="sending"
            class="animate-spin h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full"></span>
          {{ sending ? 'Sending...' : 'Send Test Email' }}
        </button>

        <div v-if="emailMessage"
          :class="`p-4 rounded-xl text-sm ${emailSuccess ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`">
          {{ emailMessage }}
        </div>
      </div>
    </div>


    <!-- Appearance & Themes -->
    <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-semibold text-white font-display">Appearance</h2>
          <p class="text-slate-400 text-sm mt-1">Personalize your HQ with a variety of premium visual styles.</p>
        </div>
        <div class="w-full md:w-64">
          <input 
            v-model="themeSearch"
            type="text" 
            placeholder="Search themes or colors..." 
            class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-accent-primary outline-none transition-all"
          />
        </div>
      </div>

      <div class="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <div v-for="(groupThemes, category) in filteredThemes" :key="category" class="space-y-4">
          <div class="flex items-center gap-4">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-500">{{ category }}</h3>
            <div class="h-px flex-1 bg-slate-700/50"></div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button 
              v-for="theme in groupThemes" 
              :key="theme.key"
              @click="applyTheme(theme.key)"
              class="group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 text-left"
              :class="currentTheme === theme.key 
                ? 'bg-accent-primary/5 border-accent-primary shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.2)]' 
                : 'bg-slate-900/50 border-slate-700 hover:border-accent-primary/50 hover:bg-slate-800/50'"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-sm" :class="currentTheme === theme.key ? 'text-accent-primary' : 'text-slate-300'">
                  {{ theme.name }}
                </span>
                <div 
                  v-if="currentTheme === theme.key"
                  class="h-2 w-2 rounded-full bg-accent-primary shadow-[0_0_8px_var(--accent-primary)]"
                ></div>
              </div>
              <p class="text-[10px] text-slate-500 uppercase tracking-tighter">
                {{ theme.category }} Style
              </p>
              
              <!-- Mini Preview Strip -->
              <div class="flex gap-1 mt-3">
                <div 
                  v-for="(color, idx) in theme.colors?.slice(0, 3)" 
                  :key="idx"
                  class="h-1.5 rounded-full opacity-60 transition-all group-hover:opacity-100"
                  :class="[
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
                  ]"
                ></div>
              </div>
            </button>
          </div>
        </div>

        <div v-if="Object.keys(filteredThemes).length === 0" class="py-12 text-center border-2 border-dashed border-slate-700 rounded-3xl">
          <span class="text-slate-500 font-medium">No themes match your search criteria.</span>
        </div>
      </div>
    </div>


    <!-- Activity Log Debug -->
    <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-white">Activity Logs (Debug)</h2>
        <button @click="refreshLogs" class="text-sm text-indigo-400 hover:text-indigo-300">
          Refresh
        </button>
      </div>
      <div class="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
        <div v-for="log in logs" :key="log.id" class="p-2 bg-slate-900 rounded border border-slate-700">
            <div class="flex justify-between text-slate-400 mb-1">
                <span>{{ log.action }}</span>
                <span>{{ log.timestamp?.toDate?.()?.toLocaleString() }}</span>
            </div>
            <div class="text-slate-500 truncate">
                {{ JSON.stringify(log.metadata) }}
            </div>
        </div>
        <div v-if="logs.length === 0" class="text-slate-500 text-center py-4">
            No logs found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskPreferences, type TaskCategory } from '~/composables/useTaskPreferences'
import { useToast } from '~/composables/useToast'
import { useActivityLog } from '~/composables/useActivityLog'
import { useTheme } from '~/composables/useTheme'
import type { ActivityItem } from '~/types'

const { sendEmail } = useEmail()
const user = useCurrentUser()
const audit = useActivityLog()
const logs = ref<ActivityItem[]>([])
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



const refreshLogs = async () => {
    logs.value = await audit.fetchRecent(10)
}

onMounted(() => {
    refreshLogs()
})

const {
  categories,
  loading: prefsLoading,
  addCategory,
  updateCategory,
  deleteCategory,
  resetToDefaults
} = useTaskPreferences()

// Email state
const sending = ref(false)
const emailMessage = ref('')
const emailSuccess = ref(false)

// Category form state
const editingCategory = ref<TaskCategory | null>(null)
const isCategoriesExpanded = ref(false)
const categoryForm = ref({
  label: '',
  emoji: '',
  color: 'bg-emerald-900/50 text-emerald-300'
})

const editCategory = (cat: TaskCategory) => {
  editingCategory.value = cat
  categoryForm.value = {
    label: cat.label,
    emoji: cat.emoji,
    color: cat.color
  }
}

const cancelEdit = () => {
  editingCategory.value = null
  categoryForm.value = { label: '', emoji: '', color: 'bg-emerald-900/50 text-emerald-300' }
}

const { success, error, info, warning } = useToast()

const testToasts = () => {
    success('Settings saved successfully')
    setTimeout(() => error('Failed to save settings'), 1000)
    setTimeout(() => info('New update available'), 2000)
    setTimeout(() => warning('Approaching storage limit'), 3000)
}

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, {
        label: categoryForm.value.label,
        emoji: categoryForm.value.emoji,
        color: categoryForm.value.color
      })
    } else {
      await addCategory({
        label: categoryForm.value.label,
        emoji: categoryForm.value.emoji,
        color: categoryForm.value.color
      })
    }
    cancelEdit()
  } catch (e: any) {
    alert(e.message)
  }
}

const removeCategory = async (id: string) => {
  if (confirm('Remove this category? Tasks using it will keep the category ID but it won\'t display.')) {
    await deleteCategory(id)
  }
}

const resetCategories = async () => {
  if (confirm('Reset all categories to defaults? This cannot be undone.')) {
    await resetToDefaults()
  }
}

const testEmail = async () => {
  if (!user.value) return
  sending.value = true
  emailMessage.value = ''

  try {
    const result = await sendEmail({
      to_email: user.value.email,
      subject: 'Test Email from Structure App',
      message: 'This is a test email to verify your EmailJS configuration.'
    })

    if (result.success) {
      emailSuccess.value = true
      emailMessage.value = 'Email sent successfully! Check your inbox.'
    } else {
      emailSuccess.value = false
      emailMessage.value = 'Failed to send email. Check console for details.'
    }
  } catch (e: any) {
    emailSuccess.value = false
    emailMessage.value = e.message || 'An unexpected error occurred.'
  } finally {
    sending.value = false
  }
}
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
