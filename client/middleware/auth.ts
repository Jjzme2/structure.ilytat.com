import { useFirebaseAuth } from 'vuefire'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = useFirebaseAuth()
    if (!auth) return

    try {
        await auth.authStateReady()
        const user = auth.currentUser

        if (!user) {
            return navigateTo({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            })
        }
    } catch (e) {
        console.error('Auth Middleware Error:', e)
    }
})
