import { initializeApp, cert, getApps } from 'firebase-admin/app';

export default defineNitroPlugin(() => {
    const config = useRuntimeConfig();

    if (getApps().length === 0 && config.firebaseAdminPrivateKey && config.firebaseAdminClientEmail) {
        try {
            initializeApp({
                credential: cert({
                    projectId: config.public.firebaseProjectId,
                    clientEmail: config.firebaseAdminClientEmail,
                    privateKey: config.firebaseAdminPrivateKey.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin Initialized');
        } catch (error) {
            console.error('Failed to initialize Firebase Admin:', error);
        }
    }
});
