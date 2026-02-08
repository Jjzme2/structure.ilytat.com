<script setup lang="ts">
import { collection, query, orderBy } from 'firebase/firestore'
import { useFirestore, useCollection, useCurrentUser } from 'vuefire'
import type { UserProfile } from '~/types'
import MessageUserModal from '~/components/users/MessageUserModal.vue'

const db = useFirestore()
const user = useCurrentUser()
const searchQuery = ref('')


// Query all users (publicly readable via Firestore rules)
const usersQuery = query(collection(db, 'users'), orderBy('displayName'))
const { data: users, pending } = useCollection<UserProfile>(usersQuery)

const filteredUsers = computed(() => {
    if (!users.value) return []
    if (!searchQuery.value) return users.value

    const q = searchQuery.value.toLowerCase()
    return users.value.filter(u =>
        (u.displayName?.toLowerCase().includes(q)) ||
        (u.email?.toLowerCase().includes(q)) ||
        (u.roles?.some(r => r.toLowerCase().includes(q))) ||
        (u.bio?.toLowerCase().includes(q))
    )
})

const copyEmail = (email: string | null) => {
    if (!email) return
    navigator.clipboard.writeText(email)
}

const selectedRecipient = ref<UserProfile | null>(null)
const isMessageModalOpen = ref(false)

const openMessageModal = (userProfile: UserProfile) => {
    selectedRecipient.value = userProfile
    isMessageModalOpen.value = true
}
</script>

<template>
    <div class="max-w-7xl mx-auto space-y-12 pb-20 text-slate-200">

        <!-- Hero Section -->
        <div class="text-center space-y-4 py-10">
            <h1
                class="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
                Who We Are
            </h1>
            <p class="text-lg text-slate-400 max-w-2xl mx-auto">
                Meet the team behind the mission. Connect, collaborate, and build together.
            </p>
        </div>

        <!-- Search & Filter -->
        <div class="flex justify-center">
            <div class="relative group w-full max-w-lg">
                <div
                    class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500">
                </div>
                <div
                    class="relative flex items-center bg-slate-900 border border-slate-700/50 rounded-xl p-2 shadow-2xl">
                    <svg class="w-5 h-5 ml-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input v-model="searchQuery" type="text"
                        class="w-full bg-transparent border-none text-slate-200 placeholder-slate-500 focus:ring-0 px-4 py-2 outline-none"
                        placeholder="Search by name, role, email, or bio..." />
                </div>
            </div>
        </div>

        <!-- Grid -->
        <div v-if="pending" class="flex justify-center py-20">
            <div class="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="text-center py-20">
            <div class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/50 mb-4">
                <svg class="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <p class="text-slate-500 font-medium">No team members found.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
            <div v-for="userProfile in filteredUsers" :key="userProfile.uid"
                class="group relative bg-white/5 border border-white/10 hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden backdrop-blur-sm flex flex-col h-full">

                <!-- Background Gradient -->
                <div
                    class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                </div>

                <!-- Role Badge -->
                <div class="flex justify-end mb-4 relative z-10 w-full min-h-[24px]">
                    <span v-for="role in userProfile.roles" :key="role"
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mx-1"
                        :class="role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-700/50 text-slate-400 border border-slate-700'">
                        {{ role }}
                    </span>
                </div>

                <!-- Avatar & Info -->
                <div class="flex flex-col items-center text-center relative z-10 flex-1">
                    <div
                        class="h-24 w-24 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-xl mb-5 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <img v-if="userProfile.photoURL" :src="userProfile.photoURL"
                            class="h-full w-full object-cover" />
                        <span v-else class="text-3xl font-black text-slate-700">{{ userProfile.displayName?.charAt(0) ||
                            userProfile.email?.charAt(0) }}</span>
                    </div>

                    <h3 class="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{{
                        userProfile.displayName || 'Team Member' }}</h3>

                    <!-- Authenticated: Show Email -->
                    <p v-if="user" class="text-sm text-slate-400 font-medium mb-4 break-all">{{ userProfile.email }}</p>

                    <!-- Bio Section (Always visible if exists, or fallback if unauthenticated) -->
                    <div v-if="userProfile.bio" class="text-sm text-slate-400 italic mb-6 line-clamp-3 px-2">
                        "{{ userProfile.bio }}"
                    </div>

                    <div class="flex-1"></div> <!-- Spacer -->

                    <!-- Authenticated Actions -->
                    <!-- Authenticated Actions -->
                    <div v-if="user" class="flex flex-col gap-2 w-full mt-4">
                        <button @click="openMessageModal(userProfile)"
                            class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 text-white font-bold text-xs uppercase tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Message
                        </button>

                        <div class="flex gap-2">
                            <a :href="`mailto:${userProfile.email}`"
                                class="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wide transition-all border border-slate-700">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                            </a>
                            <button @click="copyEmail(userProfile.email)"
                                class="px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
                                title="Copy Email">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>



                    <div
                        class="mt-6 pt-4 border-t border-white/5 w-full flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        <span>Joined</span>
                        <span>{{ userProfile.createdAt ? new Date(userProfile.createdAt.seconds *
                            1000).toLocaleDateString() : 'Unknown' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <MessageUserModal 
        :is-open="isMessageModalOpen" 
        :recipient="selectedRecipient"
        @close="isMessageModalOpen = false"
    ></MessageUserModal>
</template>

<style scoped>
</style>
