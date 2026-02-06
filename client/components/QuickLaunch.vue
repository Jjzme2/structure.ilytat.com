<script setup lang="ts">
import { memberQuickLaunch, adminQuickLaunch } from '~/config/quicklaunch'

const { profile } = useUserProfile()
const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const menuItems = computed(() => {
    if (profile.value?.role === 'admin') {
        return adminQuickLaunch
    }
    return memberQuickLaunch
})

// Close menu when clicking outside
const closeMenu = (e: MouseEvent) => {
    if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
    document.removeEventListener('click', closeMenu)
})
</script>

<template>
    <div ref="menuRef" class="relative inline-block text-left">
        <div>
            <button @click="isOpen = !isOpen"
                class="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-muted hover:text-text-primary glass-pill transition-all whitespace-nowrap group">
                <div
                    class="h-5 w-5 rounded-md bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white/90 shadow-lg group-hover:scale-110 transition-transform">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span class="hidden md:block font-bold">Quick Launch</span>
                <svg class="w-4 h-4 opacity-50 transition-transform duration-300" :class="isOpen ? 'rotate-180' : ''"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>

        <transition enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isOpen"
                class="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-glass backdrop-blur-xl border border-glass shadow-2xl focus:outline-none p-1 z-50">
                <div class="px-1 py-1">
                    <div class="px-3 py-2 border-b border-glass mb-1">
                        <p class="text-xs font-bold text-muted uppercase tracking-wider">
                            {{ profile?.role === 'admin' ? 'Command Center' : 'Shortcuts' }}
                        </p>
                    </div>
                    <div v-for="item in menuItems" :key="item.path">
                        <NuxtLink :to="item.path" :target="item.newTab ? '_blank' : undefined" @click="isOpen = false"
                            class="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all text-muted hover:text-text-primary hover:bg-white/5"
                            active-class="bg-accent-primary/10 text-accent-primary">
                            <!-- Icon Placeholder -->
                            <div class="w-5 h-5 flex items-center justify-center opacity-70 group-hover:opacity-100">
                                <span v-if="item.icon === 'check-circle'">✓</span>
                                <span v-else-if="item.icon === 'calendar'">📅</span>
                                <span v-else-if="item.icon === 'plus-circle'">+</span>
                                <span v-else-if="item.icon === 'view-grid'">⊞</span>
                                <span v-else-if="item.icon === 'users'">👥</span>
                                <span v-else-if="item.icon === 'cog'">⚙️</span>
                                <span v-else>•</span>
                            </div>
                            {{ item.label }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
