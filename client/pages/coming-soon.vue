<template>
    <div
        class="min-h-screen relative overflow-hidden bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30">
        <!-- Background Layer (Reusing landing page aesthetic) -->
        <div
            class="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]">
        </div>

        <div
            class="relative z-10 max-w-7xl mx-auto px-6 py-12 min-h-screen flex flex-col items-center justify-center text-center">
            <!-- Glow Effect -->
            <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none">
            </div>

            <div class="space-y-8 animate-fade-in-up">
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl text-[10px] font-black tracking-[0.3em] uppercase text-emerald-400">
                    Internal Protocol 404-STAGING
                </div>

                <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-white leading-tight">
                    SYSTEM <br />
                    <span
                        class="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500">INITIALIZING</span>
                </h1>

                <p
                    class="text-slate-400 font-medium max-w-md mx-auto leading-relaxed border-l-2 border-emerald-500/20 pl-6 text-left">
                    The requested documentation module is currently under encryption review. ILYTAT HQ legal frameworks
                    are being finalized for the current operational cycle.
                </p>

                <div class="flex flex-col items-center gap-6 pt-8">
                    <div class="flex gap-2">
                        <div class="h-1 w-8 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div class="h-1 w-4 bg-slate-800 rounded-full"></div>
                        <div class="h-1 w-4 bg-slate-800 rounded-full"></div>
                    </div>

                    <NuxtLink to="/"
                        class="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white font-bold tracking-widest rounded-xl hover:bg-white/10 transition-all uppercase text-xs group">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            RTB: Return to Base
                        </span>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'empty',
    middleware: 'guest'
})
</script>

<style scoped>
.animate-fade-in-up {
    opacity: 0;
    animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
