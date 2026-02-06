<template>
  <div class="space-y-4">
    <div class="relative group">
      <input 
        type="file" 
        @change="handleUpload" 
        class="hidden" 
        id="document-upload" 
        :disabled="uploading"
      >
      <label 
        for="document-upload" 
        :class="[
          'relative block w-full text-center py-8 px-4 border-2 border-dashed rounded-2xl transition-all duration-300 font-medium cursor-pointer overflow-hidden',
          uploading 
            ? 'border-indigo-500/50 bg-indigo-500/5 text-indigo-400 cursor-not-allowed' 
            : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white hover:border-pink-500 hover:bg-slate-900 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.1)]'
        ]"
      >
        <div class="relative z-10 flex flex-col items-center gap-3">
          <div v-if="uploading" class="animate-spin text-2xl">
            ⏳
          </div>
          <div v-else class="text-3xl transition-transform duration-300 group-hover:scale-110">
            📄
          </div>
          
          <div class="space-y-1">
            <span class="block text-lg font-bold">
              {{ uploading ? 'Uploading...' : 'Upload Document' }}
            </span>
            <span v-if="!uploading" class="block text-xs text-slate-500">
              Click to browse or drag file here
            </span>
          </div>
        </div>

        <!-- Progress Bar (Fake for now or use real if available) -->
        <div 
          v-if="uploading" 
          class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-300 w-full animate-pulse"
        ></div>
      </label>
    </div>

    <div v-if="error" class="text-sm text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-xl flex items-center gap-2">
      <span>⚠️</span>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useR2 } from '~/composables/useR2'

const { uploadDocument, uploading, error } = useR2()

const handleUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  
  const file = input.files[0]
  if (file) {
    await uploadDocument(file)
  }
  input.value = '' // Reset input
}
</script>
