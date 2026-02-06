import { useFirebaseAuth } from 'vuefire'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = useFirebaseAuth()
    if (!auth) return

    try {
        await auth.authStateReady()
        const user = auth.currentUser

        if (user) {
            return navigateTo('/dashboard')
        }
    } catch (e) {
        console.error('Guest Middleware Error:', e)
    }
})
