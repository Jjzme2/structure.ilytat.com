<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-start justify-center pt-20 md:pt-[20vh] px-2 md:px-4" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="close"></div>

    <!-- Modal -->
    <div class="relative w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden animate-scale-in">
      
      <!-- Input -->
      <div class="flex items-center px-4 py-3 border-b border-slate-800">
        <svg class="w-5 h-5 text-slate-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input ref="inputRef" v-model="searchQuery" type="text" 
          class="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
          placeholder="Type a command or search..."
          @keydown="handleKeydown" />
        <span class="text-xs text-slate-600 border border-slate-800 rounded px-1.5 py-0.5">ESC</span>
      </div>

      <!-- Results -->
      <div class="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
        <div v-for="(cmds, section) in groupedCommands" :key="section" class="mb-2">
          <button @click="toggleSection(section as string)" 
            class="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors">
            <span>{{ section }}</span>
            <svg class="w-4 h-4 transition-transform duration-200" 
                 :class="{ '-rotate-90': collapsedSections[section as string] }"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div v-show="!collapsedSections[section as string]" class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            <button v-for="cmd in cmds" :key="cmd.id"
                class="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg group transition-colors"
                :class="[ activeId === cmd.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800' ]"
                @click="execute(cmd)"
                @mouseenter="activeId = cmd.id">
                
                <div class="flex items-center justify-center w-6 h-6 rounded bg-slate-800 text-slate-400 group-hover:text-white"
                    :class="{ '!bg-indigo-500 !text-white': activeId === cmd.id }">
                <!-- Simple Icon Placeholder, could be dynamic component -->
                <span class="text-xs">{{ cmd.icon }}</span>
                </div>

                <span class="flex-1 font-medium flex items-center gap-2">
                {{ cmd.label }}
                <svg v-if="cmd.external" class="w-3 h-3 text-slate-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                </span>

                <div v-if="cmd.shortcut" class="flex items-center gap-1">
                    <span v-for="key in cmd.shortcut" :key="key" 
                        class="text-[10px] px-1.5 py-0.5 rounded border"
                        :class="[ activeId === cmd.id ? 'border-indigo-400 text-indigo-100' : 'border-slate-700 text-slate-500' ]">
                        {{ key }}
                    </span>
                </div>
            </button>
          </div>
        </div>
        
        <div v-if="Object.keys(groupedCommands).length === 0" class="py-8 text-center text-slate-500">
            No commands found.
        </div>
      </div>
    
      <!-- Footer -->
      <div class="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div class="flex gap-4">
            <span>Example: "Go to Tasks"</span>
            <span>"Create Note"</span>
        </div>
        <div>
            Results: {{ filteredCommands.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommandPalette } from '~/composables/useCommandPalette'
import type { CommandItem } from '~/types'
import { useCurrentUser } from 'vuefire'

const { isOpen, searchQuery, close, commands, groupedCommands: allGroups } = useCommandPalette()
const inputRef = ref<HTMLInputElement | null>(null)
const activeId = ref<string | null>(null)

const user = useCurrentUser()
const isAdmin = ref(false)

watch(user, async (newUser) => {
    if (newUser) {
        const token = await newUser.getIdTokenResult()
        isAdmin.value = token.claims.role === 'admin' || token.claims.admin === true
    } else {
        isAdmin.value = false
    }
}, { immediate: true })

const filteredCommands = computed(() => {
    let items = commands.value
    
    // Filter by admin access
    if (!isAdmin.value) {
        items = items.filter((cmd: CommandItem) => !cmd.adminOnly)
    }

    if (!searchQuery.value) return items

    const query = searchQuery.value.toLowerCase()
    return items.filter((cmd: CommandItem) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.keywords.some((k: string) => k.toLowerCase().includes(query))
    )
})

// Group commands by section
const groupedCommands = computed(() => {
    const groups: Record<string, CommandItem[]> = {}
    filteredCommands.value.forEach((cmd: CommandItem) => {
        if (!groups[cmd.section]) {
            groups[cmd.section] = []
        }
        groups[cmd.section]?.push(cmd)
    })
    return groups
})

// Auto-focus input when opened
watch(isOpen, async (val) => {
    if (val) {
        await nextTick()
        inputRef.value?.focus()
        // Reset active selection to first item
        if (filteredCommands.value.length > 0) {
            const first = filteredCommands.value[0]
            if (first) activeId.value = first.id
        }
    }
})

// Keyboard Navigation
const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        close()
        return
    }

    const items = filteredCommands.value
    if (items.length === 0) return

    const currentIndex = items.findIndex(c => c.id === activeId.value)

    if (e.key === 'ArrowDown') {
        e.preventDefault()
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        const nextItem = items[nextIndex]
        if (nextItem) {
            activeId.value = nextItem.id
            scrollIntoView(activeId.value)
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        const prevItem = items[prevIndex]
        if (prevItem) {
            activeId.value = prevItem.id
            scrollIntoView(activeId.value)
        }
    } else if (e.key === 'Enter') {
        e.preventDefault()
        const activeCmd = items.find(c => c.id === activeId.value)
        if (activeCmd) execute(activeCmd)
    }
}

const scrollIntoView = (id: string) => {
    // Basic implementation - relies on DOM id if we set it, or just keeping it simple for now
    // Ideally we'd set :id on the button and use document.getElementById(id)?.scrollIntoView()
    // but for now, mouse hover handles most cases and this is "good enough" for alpha
}

// Accordion State
const collapsedSections = ref<Record<string, boolean>>({})

const toggleSection = (section: string) => {
    collapsedSections.value[section] = !collapsedSections.value[section]
}

// Expand all when searching
watch(searchQuery, (newQuery) => {
    if (newQuery) {
        Object.keys(groupedCommands.value).forEach(key => {
            collapsedSections.value[key] = false
        })
    }
})

// Initialize/Reset state
watch(groupedCommands, (newGroups) => {
    // If no search query, maybe default to first open, others closed?
    // For now, let's keep them all open by default or obey user interaction
    // If keys change, ensure we track them. 
    // Let's default to 'Quick Links' and 'System' collapsed if desired, but 'Apps' open.
    // For simplicity, everything open by default unless toggled.
}, { immediate: true })

const execute = (cmd: CommandItem) => {
    cmd.action()
    close()
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 20px;
}

.animate-scale-in {
    animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
