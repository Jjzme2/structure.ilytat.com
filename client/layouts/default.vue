<script setup lang="ts">
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { signOut } from 'firebase/auth'
import { config } from '~/config'

const user = useCurrentUser()
const auth = useFirebaseAuth()
const router = useRouter()
const { activeModules } = useModules()
const { initTheme, themes, currentTheme, applyTheme } = useTheme()
const { isOpen } = useCommandPalette()
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const isInboxOpen = ref(false)

// Profile Menu State
const isProfileMenuOpen = ref(false)
const profileMenuRef = ref<HTMLElement | null>(null)

// Initialize session timeout monitoring
useSessionTimeout()

const logout = async () => {
  isProfileMenuOpen.value = false
  if (auth) {
    await signOut(auth)
    router.push('/login')
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > config.ui.scrollThreshold
}

const closeProfileMenu = (e: MouseEvent) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(e.target as Node)) {
    isProfileMenuOpen.value = false
  }
}

const closeOnEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isProfileMenuOpen.value = false
  }
}

onMounted(() => {
  initTheme()
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', closeProfileMenu)
  document.addEventListener('keydown', closeOnEscape)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', closeProfileMenu)
  document.removeEventListener('keydown', closeOnEscape)
})

watch(user, async (currentUser, prevUser) => {
  if (prevUser && !currentUser) {
    return router.push('/login')
  }
})

const isAdmin = ref(false)
watch(user, async (newUser) => {
  if (newUser) {
    const token = await newUser.getIdTokenResult()
    isAdmin.value = token.claims.role === 'admin' || token.claims.admin === true
  } else {
    isAdmin.value = false
  }
}, { immediate: true })

watch(() => router.currentRoute.value.path, () => {
  isMenuOpen.value = false
  isProfileMenuOpen.value = false
})
</script>

<template>
  <div
    class="min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-accent-primary selection:text-bg-primary pb-12 transition-colors duration-500">
    <UiToastContainer />
    <LayoutInboxPanel :is-open="isInboxOpen" @close="isInboxOpen = false" />
    <!-- Glassmorphism Navbar Container -->
    <div v-if="user" class="fixed top-0 w-full z-50 flex justify-center pt-4 md:pt-6 px-2 md:px-4">
      <nav class="max-w-5xl w-full glass-nav rounded-2xl md:rounded-3xl px-4 md:px-5 transition-all duration-500"
        :class="isScrolled ? 'py-1.5 md:py-2' : 'py-2 md:py-4'">
        <div class="flex items-center justify-between h-full">
          <!-- Logo Section -->
          <NuxtLink to="/" class="group flex items-center gap-2 md:gap-3">
            <div
              class="h-7 w-7 md:h-9 md:w-9 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <img src="https://media.ilytat.com/logo.png" alt="ILYTAT Logo" class="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <span class="text-lg md:text-xl font-black tracking-tighter text-text-primary font-display drop-shadow-md">
              Headquarters
            </span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-4">
            <!-- Search Hint / Command Trigger -->
            <button @click="isOpen = true"
              class="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-text-primary glass-pill transition-all duration-300 cursor-pointer mr-2">
              <svg class="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="opacity-70 group-hover:opacity-100 transition-opacity">Search</span>
              <div class="flex items-center gap-0.5 opacity-40 group-hover:opacity-80 transition-opacity ml-1">
                <kbd
                  class="min-w-[1.2em] px-1 py-0.5 rounded border border-current text-[10px] font-mono flex items-center justify-center">⌘</kbd>
                <kbd
                  class="min-w-[1.2em] px-1 py-0.5 rounded border border-current text-[10px] font-mono flex items-center justify-center">K</kbd>
              </div>
            </button>
          </div>

          <!-- User Controls -->
          <div class="flex items-center gap-2 md:gap-4">
            <div class="flex items-center gap-2 md:gap-4">
              <TenantSwitcher />
              <LayoutNotificationBell @click="isInboxOpen = true" />



              <!-- Profile Dropdown -->
              <div ref="profileMenuRef" class="relative hidden sm:block">
                <button
                  @click="isProfileMenuOpen = !isProfileMenuOpen"
                  class="relative outline-none group focus-visible:ring-2 focus-visible:ring-accent-primary rounded-full"
                  aria-label="Profile Menu"
                  aria-haspopup="true"
                  :aria-expanded="isProfileMenuOpen">
                  <div
                    class="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur transition duration-500"
                    :class="isProfileMenuOpen ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'">
                  </div>
                  <div
                    class="relative h-9 w-9 rounded-full bg-slate-900 border flex items-center justify-center text-xs font-black text-accent-primary overflow-hidden shadow-inner transition-colors"
                    :class="isProfileMenuOpen ? 'border-accent-primary' : 'border-slate-700 group-hover:border-accent-primary'">
                    {{ user?.email?.charAt(0).toUpperCase() || '?' }}
                  </div>
                </button>

                <!-- Dropdown Menu -->
                <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0">
                  <div v-show="isProfileMenuOpen"
                    class="absolute right-0 top-full mt-2 w-48 rounded-xl bg-glass backdrop-blur-xl border border-glass shadow-2xl origin-top-right z-50 p-1"
                    aria-label="Profile Options"
                    role="menu">
                    <div class="px-4 py-3 border-b border-glass mb-1" role="presentation">
                    <p class="text-xs font-bold text-muted uppercase tracking-wider">{{ user?.displayName ||
                      user?.email?.split('@')[0] || 'Operator' }}</p>
                    <p class="text-sm font-medium text-text-primary truncate">{{ user?.email }}</p>
                  </div>

                  <NuxtLink v-if="isAdmin" to="/admin"
                    class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left group/admin"
                    role="menuitem">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Panel
                  </NuxtLink>

                  <NuxtLink to="/settings"
                    class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-text-primary hover:bg-white/5 transition-colors text-left group/settings"
                    role="menuitem">
                    <svg class="w-4 h-4 group-hover/settings:rotate-90 transition-transform duration-500" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </NuxtLink>

                  <button @click="logout"
                    class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    role="menuitem">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                  </div>
                </transition>
              </div>
            </div>

            <!-- Mobile Search Trigger -->
            <button @click="isOpen = true"
              class="md:hidden h-10 w-10 rounded-xl glass-pill flex items-center justify-center text-muted transition-all active:scale-95 mr-2">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>

    <!-- Main Content Area -->
    <main class="pt-20 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 800px;
  overflow: hidden;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}
</style>
