// https://nuxt.com/docs/api/configuration/nuxt-config
// Reload triggered for layer integration - standardized root structure
export default defineNuxtConfig({
  extends: [
    './ilytat_common_packages/packages/ilytat-admin-panel'
  ],
  compatibilityDate: '2026-02-05',
  devtools: { enabled: true },
  devServer: {
    port: 5757, // Change this to your desired port
  },
  srcDir: 'client',
  serverDir: 'server',
  app: {
    head: {
      title: 'Headquarters | ILYTAT Digital Office',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    'nuxt-vuefire',
  ],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  vuefire: {
    auth: {
      enabled: true,
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },
  runtimeConfig: {
    firebaseAdminPrivateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    firebaseAdminClientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    public: {
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      emailjsServiceId: process.env.EMAILJS_SERVICE_ID,
      emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID,
      emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY,
    }
  }
})

