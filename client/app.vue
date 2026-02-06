<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator color="#818cf8" />
      <NuxtPage />
    </NuxtLayout>
    <CommandPalette />
  </div>
</template>

<script setup lang="ts">
import CommandPalette from '~/components/ui/CommandPalette.vue'
import { useCommandPalette } from '~/composables/useCommandPalette'

const { toggle } = useCommandPalette()

onMounted(() => {
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault()
            toggle()
        }
    })
})
</script>
