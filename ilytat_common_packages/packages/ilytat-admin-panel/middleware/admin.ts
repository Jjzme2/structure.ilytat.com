import { getCurrentUser } from 'vuefire';

export default defineNuxtRouteMiddleware(async (to: any, from: any) => {
    const user = await getCurrentUser()

    if (!user) return navigateTo('/login') && console.log('No user');

    try {
        const token = await user.getIdTokenResult()
        // Check if user has admin role in custom claims
        // customized claims via firebase-admin are usually on token.claims
        if (token.claims.role === 'admin' || token.claims.admin === true) {
            return
        }

    } catch (e) {
        console.error('Error checking admin status', e)
    }

    return navigateTo('/')
})
