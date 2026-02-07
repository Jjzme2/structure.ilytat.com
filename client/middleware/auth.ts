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

        // Check for Force Password Reset claim
        const idTokenResult = await user.getIdTokenResult()
        if (idTokenResult.claims.forcePasswordReset && to.path !== '/forgot-password' && to.path !== '/login') {
            console.warn('[Auth] Mandatory Password Reset Detected')
            return navigateTo('/forgot-password')
        }
    } catch (e) {
        console.error('Auth Middleware Error:', e)
    }
})
