<script setup lang="ts">
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { signOut } from 'firebase/auth'
import { config } from '~/config'
import { useTenant } from '~/composables/useTenant'
import { useDevice } from '~/composables/useDevice'
import MessageUserModal from '~/components/users/MessageUserModal.vue'
import { useMessageModal } from '~/composables/useMessageModal'
import { useToast } from '~/composables/useToast'
import type { UserProfile, InboxItem } from '~/types'
import { useUserProfile } from '~/composables/useUserProfile'

const { isDesktop } = useDevice()

const user = useCurrentUser()
const auth = useFirebaseAuth()
const router = useRouter()
const { isAdmin: profileIsAdmin } = useUserProfile()
const { activeModules } = useModules()
const { initTheme, themes, currentTheme, applyTheme } = useTheme()
const { isOpen } = useCommandPalette()
const { scope } = useTenant()
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const isInboxOpen = ref(false)
const { error } = useToast()

// Message Modal State
const { isOpen: isMessageModalOpen, recipient: messageRecipient, initialSubject: messageInitialSubject, open: openMessageModal, close: closeMessageModal } = useMessageModal()

const handleReply = (msg: InboxItem) => {
  if (!msg.fromId) {
    error('Cannot reply: Original sender ID not found (message predates this feature).')
    return
  }

  const recipient = {
    uid: msg.fromId,
    displayName: msg.from,
    email: null,
    createdAt: new Date()
  } as UserProfile

  const subject = msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`
  openMessageModal(recipient, subject)
}

// Initialize session timeout monitoring
useSessionTimeout()

const logout = async () => {
  if (auth) {
    await signOut(auth)
    router.push('/login')
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > config.ui.scrollThreshold
}
useEventListener(window, 'scroll', handleScroll)

onMounted(() => {
  initTheme()
})

watch(user, async (currentUser, prevUser) => {
  if (prevUser && !currentUser) {
    return router.push('/login')
  }
})

watch(isDesktop, (val) => {
  if (val) isMenuOpen.value = false
})

watch(() => router.currentRoute.value.path, () => {
  isMenuOpen.value = false
})
</script>

<template>
  <div
    class="min-h-screen bg-bg-primary text-text-primary font-sans selection:bg-accent-primary selection:text-bg-primary pb-12 transition-colors duration-500">
    <UiToastContainer />
    <UiToastContainer />
    <LayoutInboxPanel :is-open="isInboxOpen" @close="isInboxOpen = false" @reply="handleReply" />
    <MessageUserModal :is-open="isMessageModalOpen" :recipient="messageRecipient"
      :initial-subject="messageInitialSubject" @close="isMessageModalOpen = false" @sent="isMessageModalOpen = false" />
    <!-- Glassmorphism Navbar Container -->
    <!-- Glassmorphism Navbar Container -->
    <div v-if="user" class="fixed top-0 w-full z-50 flex justify-center pt-4 md:pt-6 px-2 md:px-4 pointer-events-none">
      <nav
        class="max-w-[1600px] w-full rounded-2xl md:rounded-3xl px-4 md:px-5 transition-all duration-500 border pointer-events-auto"
        :class="[
          isScrolled ? 'py-1.5 md:py-2' : 'py-2 md:py-4',
          scope === 'company'
            ? 'bg-slate-900/60 backdrop-blur-xl border-indigo-500/10 shadow-[0_4px_30px_rgba(99,102,241,0.1)]'
            : 'bg-slate-900/60 backdrop-blur-xl border-emerald-500/10 shadow-[0_4px_30px_rgba(16,185,129,0.1)]'
        ]">
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
          <div class="hidden md:flex items-center gap-6">
            <!-- Search Hint / Command Trigger -->
            <button @click="isOpen = true"
              class="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-text-primary glass-pill transition-all duration-300 cursor-pointer">
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

          <!-- Divider -->
          <div class="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-slate-700 to-transparent mx-2">
          </div>

          <!-- User Controls -->
          <div class="flex items-center gap-2 md:gap-4">
            <div class="flex items-center gap-2 md:gap-4">
              <TenantSwitcher />
              <LayoutNotificationBell @click="isInboxOpen = true" />



              <!-- Profile Dropdown -->
              <div class="relative group hidden sm:block">
                <button class="relative outline-none">
                  <div
                    class="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500">
                  </div>
                  <div
                    class="relative h-9 w-9 rounded-full bg-slate-900 border border-slate-700 group-hover:border-accent-primary flex items-center justify-center text-xs font-black text-accent-primary overflow-hidden shadow-inner transition-colors">
                    {{ user?.email?.charAt(0).toUpperCase() || '?' }}
                  </div>
                </button>

                <!-- Dropdown Menu -->
                <div
                  class="absolute right-0 top-full mt-2 w-48 rounded-xl bg-glass backdrop-blur-xl border border-glass shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50 p-1">
                  <div class="px-4 py-3 border-b border-glass mb-1">
                    <p class="text-xs font-bold text-muted uppercase tracking-wider">{{ user?.displayName ||
                      user?.email?.split('@')[0] || 'Operator' }}</p>
                    <p class="text-sm font-medium text-text-primary truncate">{{ user?.email }}</p>
                  </div>

                  <NuxtLink to="/documents"
                    class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-text-primary hover:bg-white/5 transition-colors text-left group/docs">
                    <svg class="w-4 h-4 text-slate-500 group-hover/docs:text-pink-400 transition-colors" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Knowledge Base
                  </NuxtLink>

                  <NuxtLink to="/inbox"
                    class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-text-primary hover:bg-white/5 transition-colors text-left group/inbox">
                    <svg class="w-4 h-4 text-slate-500 group-hover/inbox:text-indigo-400 transition-colors" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Inbox
                  </NuxtLink>

                  <NuxtLink to="/admin/projects"
                    class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-text-primary hover:bg-white/5 transition-colors text-left group/projects">
                    <svg class="w-4 h-4 text-slate-500 group-hover/projects:text-violet-400 transition-colors"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Projects
                  </NuxtLink>

                  <div class="my-1 border-t border-white/5"></div>

                  <NuxtLink v-if="profileIsAdmin" to="/admin"
                    class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left group/admin">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Panel
                  </NuxtLink>

                  <NuxtLink to="/settings"
                    class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-text-primary hover:bg-white/5 transition-colors text-left group/settings">
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
                    class="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-colors text-left">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
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
    <main class="pt-20 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
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
