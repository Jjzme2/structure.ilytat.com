<template>
  <div
    class="min-h-screen flex items-center justify-center bg-bg-primary px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div class="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[100px]"></div>
    </div>

    <div v-ilytat-animate="'entrance'"
      class="max-w-md w-full space-y-8 relative z-10 p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl">
      <div>
        <h2 v-ilytat-animate="'entrance'" class="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Access <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">ILYTAT</span>
        </h2>
        <p v-ilytat-animate="'entrance'" class="mt-2 text-center text-sm text-slate-400">
          Personal organization, redefined.
        </p>
      </div>

      <!-- Email/Password Login Form -->
      <form @submit.prevent="loginWithEmail" class="mt-8 space-y-4">
        <div>
          <label for="email" class="sr-only">Email address</label>
          <input id="email" v-model="form.email" type="email" required placeholder="Email address"
            class="relative block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200" />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <div class="relative">
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
              placeholder="Password"
              class="relative block w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 pr-10" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none focus:text-indigo-400"
              :aria-label="showPassword ? 'Hide password' : 'Show password'">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-end">
          <NuxtLink to="/forgot-password" class="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Forgot your password?
          </NuxtLink>
        </div>

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
          Sign In
        </button>
      </form>



      <div v-if="error" class="text-red-400 text-center text-sm" role="alert" aria-live="polite">
        {{ error }}
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'

const auth = useFirebaseAuth()
const user = useCurrentUser()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: ''
})

definePageMeta({
  layout: 'empty'
})

watch(user, (currentUser) => {
  if (currentUser) {
    const redirectPath = route.query.redirect as string || '/'
    router.push(redirectPath)
  }
}, { immediate: true })

const loginWithEmail = async () => {
  if (!auth) return
  loading.value = true
  error.value = ''
  try {
    await signInWithEmailAndPassword(auth, form.email, form.password)
    // Redirection handled by watcher
  } catch (e: any) {
    console.error(e)
    if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
      error.value = 'Invalid email or password.'
    } else if (e.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else {
      error.value = 'Failed to sign in. Please try again.'
    }
  } finally {
    loading.value = false
  }
}


</script>
