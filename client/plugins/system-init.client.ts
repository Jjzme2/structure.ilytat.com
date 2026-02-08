import { useFirebaseApp } from 'vuefire'
import { getApps } from 'firebase/app'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    // Check if any apps are initialized before calling useFirebaseApp
    const apps = getApps()
    const firebaseApp = apps.length > 0 ? useFirebaseApp() : null

    if (import.meta.client) {
        console.log('%c 🏢 ILYTAT HQ | System Initialization ', 'background: #1e1e2e; color: #cdd6f4; font-weight: bold; padding: 4px; border-radius: 4px;')

        if (firebaseApp) {
            console.log(`%c 🔥 Firebase connected: ${config.public.firebaseProjectId} `, 'color: #f9e2af;')
        } else {
            console.warn('%c ⚠️ Firebase not initialized! ', 'color: #f38ba8;')
        }

        console.log('%c 🚀 Application started in ' + (import.meta.dev ? 'development' : 'production') + ' mode ', 'color: #89b4fa;')
    }
})
