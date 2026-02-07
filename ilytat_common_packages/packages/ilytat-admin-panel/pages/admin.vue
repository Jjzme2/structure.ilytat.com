<template>
    <div class="admin-page-wrapper min-h-screen bg-gray-900 text-white flex overflow-hidden">
        <!-- Loading State -->
        <div v-if="pending" class="flex-1 flex items-center justify-center">
            <div class="flex flex-col items-center gap-4">
                <div class="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                <p class="text-amber-500 font-mono animate-pulse tracking-widest uppercase text-xs">Verifying Access...
                </p>
            </div>
        </div>

        <NotFound v-else-if="!hasAccess && !pending" />

        <!-- Main Layout -->
        <template v-else>
            <!-- Sidebar Navigation -->
            <aside :class="[
                'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0',
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            ]">
                <div class="flex flex-col h-full">
                    <!-- Sidebar Header -->
                    <div class="p-6 border-b border-slate-800">
                        <h1 class="text-2xl font-black text-amber-500 tracking-tighter uppercase leading-none mb-1">HQ
                            Console</h1>
                        <p class="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Admin Control Layer
                            v4.0</p>
                    </div>

                    <!-- Nav Items -->
                    <nav class="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
                        <button v-for="tab in filteredTabs" :key="tab.id"
                            @click="activeTab = tab.id; isSidebarOpen = false" :class="[
                                'w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all',
                                activeTab === tab.id
                                    ? 'bg-amber-500 text-white shadow-[0_4px_15px_rgba(245,158,11,0.3)]'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            ]">
                            <span class="text-base">{{ tab.icon }}</span>
                            {{ tab.label }}
                        </button>
                    </nav>

                    <!-- Sidebar Footer -->
                    <div class="p-4 border-t border-slate-800 space-y-2">
                        <button @click="router.push('/')"
                            class="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-slate-500 hover:text-amber-500 uppercase tracking-wider transition-colors">
                            <span>🏠</span> Headquarters
                        </button>
                        <div class="px-4 py-2 bg-slate-800/50 rounded-lg">
                            <div class="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Security Level</div>
                            <div class="text-[10px] font-mono text-emerald-500 uppercase">Class 5 Clear</div>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main Content Area -->
            <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <!-- Top Header (Mobile Toggle + Context) -->
                <header
                    class="h-16 border-b border-slate-800 bg-gray-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
                    <div class="flex items-center gap-4">
                        <button @click="isSidebarOpen = !isSidebarOpen"
                            class="lg:hidden p-2 text-slate-400 hover:text-white">
                            <span class="text-xl">☰</span>
                        </button>
                        <div class="hidden sm:block">
                            <h2 class="text-sm font-black text-white uppercase tracking-wider">
                                {{ currentTabLabel }}
                            </h2>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="text-right hidden sm:block">
                            <div class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Operator
                            </div>
                            <div class="text-xs text-amber-500 font-bold">{{ currentUser?.email }}</div>
                        </div>
                        <div
                            class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500 font-bold">
                            {{ currentUser?.email?.[0]?.toUpperCase() }}
                        </div>
                    </div>
                </header>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
                    <div class="max-w-6xl mx-auto">
                        <div class="transition-all duration-300">
                            <AdminDashboard v-if="activeTab === 'dashboard'" />
                            <AdminUsers v-if="activeTab === 'users'" />
                            <AdminPermissions v-if="activeTab === 'permissions'" />
                            <AdminTasks v-if="activeTab === 'tasks'" />
                            <AdminSystem v-if="activeTab === 'system'" />
                        </div>
                    </div>
                </div>
            </main>

            <!-- Mobile Overlay -->
            <div v-if="isSidebarOpen" @click="isSidebarOpen = false"
                class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"></div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useCurrentUser } from 'vuefire';
import { useUserProfile } from '../composables/useUserProfile';

const currentUser = useCurrentUser();
const { profile, loading: isProfileLoading, initialized: isProfileReady, initializeUserProfile: initialize } = useUserProfile();
const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(false);

// Server-Side Verification (Mocked via our new API)
const { data, error, pending } = useFetch('/api/admin/verify-access', {
    lazy: true,
    server: false // Only check on client where cookie is available reliably
});

watch([data, error, pending], () => {
    console.log('[Admin] Verification Status:', {
        data: data.value,
        error: error.value,
        pending: pending.value
    });
});

// Gate Access based on Server Response
const hasAccess = computed(() => !!data.value?.access);

// Tab System - Focused Core Modules
const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'permissions', label: 'Permissions', icon: '🔐' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'system', label: 'System', icon: '⚙️' },
];

const filteredTabs = computed(() => tabs);
const activeTab = ref((route.query.tab as string) || 'dashboard');
const currentTabLabel = computed(() => tabs.find(t => t.id === activeTab.value)?.label || 'Console');

// Sync tab with URL
watch(activeTab, (newTab) => {
    router.replace({ query: { ...route.query, tab: newTab } });
});

// Handle Access Errors
watch(error, (newError) => {
    if (newError) {
        console.error('[Admin] Access verification failed:', newError);
    }
});

// Ensure generic profile init happens on client for other features
onMounted(() => {
    initialize();
});

// SEO Hardening
useHead({
    title: 'Admin Console | ILYTAT HQ',
    meta: [{ name: 'robots', content: 'noindex, nofollow' }]
});

definePageMeta({
    middleware: 'admin'
});
</script>

<style>
.admin-page-wrapper .animate-fade-in {
    animation: adminFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes adminFadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
