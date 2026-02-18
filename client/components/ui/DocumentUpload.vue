<template>
  <div class="space-y-4">
    <div class="relative group">
      <input 
        type="file" 
        @change="handleUpload" 
        class="sr-only peer"
        id="document-upload" 
        :disabled="uploading"
        :accept="allowedTypes"
        :aria-invalid="!!error"
        :aria-describedby="error ? 'upload-error' : undefined"
      >
      <label 
        for="document-upload" 
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        :class="[
          'relative block w-full text-center py-8 px-4 border-2 border-dashed rounded-2xl transition-all duration-300 font-medium cursor-pointer overflow-hidden peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-900',
          uploading 
            ? 'border-indigo-500/50 bg-indigo-500/5 text-indigo-400 cursor-not-allowed' 
            : success
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
              : isDragging
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:text-white hover:border-pink-500 hover:bg-slate-900 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.1)]'
        ]"
      >
        <div class="relative z-10 flex flex-col items-center gap-3 pointer-events-none">
          <div v-if="uploading" class="animate-spin text-2xl" aria-hidden="true">
            ⏳
          </div>
          <div v-else-if="success" class="text-3xl text-emerald-500 animate-bounce" aria-hidden="true">
            ✅
          </div>
          <div v-else class="text-3xl transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
            📄
          </div>
          
          <div class="space-y-1">
            <span class="block text-lg font-bold" role="status" aria-live="polite">
              {{ uploading ? 'Uploading...' : success ? 'Upload Complete!' : 'Upload Document' }}
            </span>
            <span v-if="!uploading && !success" class="block text-xs text-slate-500">
              Click to browse or drag file here
            </span>
             <span v-if="success" class="block text-xs text-emerald-500/80">
                File added successfully
            </span>
          </div>
        </div>

        <!-- Indeterminate Progress Bar -->
        <div 
          v-if="uploading" 
          role="progressbar"
          aria-label="Uploading file"
          class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-300 w-full animate-pulse"
        ></div>
      </label>
    </div>

    <div
      v-if="error"
      id="upload-error"
      role="alert"
      aria-live="assertive"
      class="text-sm text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-xl flex items-center gap-2"
    >
      <span aria-hidden="true">⚠️</span>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useR2 } from '~/composables/useR2'

const { uploadDocument, uploading, error } = useR2()
const isDragging = ref(false)
const success = ref(false)

const allowedTypes = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp"

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (uploading.value) return
  const files = event.dataTransfer?.files
  if (files?.length) {
    await processUpload(files[0])
  }
}

const handleUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  
  const file = input.files[0]
  if (file) {
    await processUpload(file)
  }
  input.value = '' // Reset input
}

const processUpload = async (file: File) => {
    success.value = false
    await uploadDocument(file)
    if (!error.value) {
        success.value = true
        setTimeout(() => {
            success.value = false
        }, 3000)
    }
}
</script>
