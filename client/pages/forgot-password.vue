<template>
  <div
    class="min-h-screen flex items-center justify-center bg-bg-primary px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div class="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[100px]"></div>
    </div>

    <div
      class="max-w-md w-full space-y-8 relative z-10 p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Reset <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Password</span>
        </h2>
        <p class="mt-2 text-center text-sm text-slate-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <!-- Password Reset Form -->
      <form v-if="!emailSent" @submit.prevent="handleResetPassword" class="mt-8 space-y-6">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input id="email" v-model="email" type="email" required placeholder="Email address"
            class="relative block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200" />
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20">
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </span>
            Send Reset Link
          </button>
        </div>
      </form>

      <!-- Success Message -->
      <div v-else class="mt-8 space-y-6">
        <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p class="text-emerald-400 text-center text-sm">
            Check your email! We've sent a password reset link to <span class="font-medium text-emerald-300">{{ email }}</span>.
          </p>
        </div>
        <div class="text-center">
          <p class="text-xs text-slate-500 mb-4">Didn't receive the email? Check your spam folder or try again.</p>
          <button @click="emailSent = false" class="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            Try a different email
          </button>
        </div>
      </div>

      <div v-if="error" class="text-red-400 text-center text-sm">
        {{ error }}
      </div>

      <div class="text-center mt-6">
        <NuxtLink to="/login" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Back to Sign In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendPasswordResetEmail } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'

const auth = useFirebaseAuth()
const loading = ref(false)
const error = ref('')
const email = ref('')
const emailSent = ref(false)

definePageMeta({
  layout: 'empty'
})

const handleResetPassword = async () => {
  if (!auth) return
  if (!email.value) {
    error.value = 'Please enter your email address.'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    await sendPasswordResetEmail(auth, email.value)
    emailSent.value = true
  } catch (e: any) {
    console.error(e)
    if (e.code === 'auth/user-not-found') {
      error.value = 'No account found with this email address.'
    } else if (e.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else {
      error.value = 'Failed to send reset email. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>
