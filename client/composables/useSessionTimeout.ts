import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'
import { config } from '~/config'
import { useAuthService } from '~/services/auth'

export const useSessionTimeout = () => {
    const auth = useFirebaseAuth()
    const user = useCurrentUser()
    const router = useRouter()
    const authService = useAuthService(auth)

    const timeoutId = ref<NodeJS.Timeout | null>(null)

    // Convert minutes to milliseconds
    const TIMEOUT_MS = config.session.timeoutMinutes * 60 * 1000

    // Optional warning logic could go here

    const resetTimer = () => {
        if (!user.value) return // Don't track if not logged in

        if (timeoutId.value) {
            clearTimeout(timeoutId.value)
        }

        timeoutId.value = setTimeout(handleTimeout, TIMEOUT_MS)
    }

    const handleTimeout = async () => {
        if (auth) {
            // console.log('Session timed out due to inactivity')
            await authService.logout()
            router.push('/login?reason=timeout')
        }
    }

    const setupListeners = () => {
        if (import.meta.client) {
            config.session.events.forEach((event: string) => {
                window.addEventListener(event, resetTimer)
            })
            // Start the timer initially
            resetTimer()
        }
    }

    const removeListeners = () => {
        if (import.meta.client) {
            config.session.events.forEach((event: string) => {
                window.removeEventListener(event, resetTimer)
            })
        }
        if (timeoutId.value) {
            clearTimeout(timeoutId.value)
        }
    }

    onMounted(() => {
        setupListeners()
    })

    onUnmounted(() => {
        removeListeners()
    })

    // Watch for auth state changes to start/stop listeners? 
    // For now, assuming this composable is used in a layout where auth is required or present.

    return {
        resetTimer
    }
}
