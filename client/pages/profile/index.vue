<script setup lang="ts">
// Redirect to new settings page
await navigateTo('/settings?tab=profile')
</script>

<template>
    <div class="flex items-center justify-center py-20">
        <div class="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
</template>
