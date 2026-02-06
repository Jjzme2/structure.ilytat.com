import { getFirestore } from 'firebase-admin/firestore';
import type { Quote } from '~/types';
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    await requireAuth(event)

    try {
        const db = getFirestore();
        const quotesRef = db.collection('quotes');
        const snapshot = await quotesRef.where('userId', '==', 'system').get();

        if (snapshot.empty) {
            return [];
        }

        const quotes: Quote[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Quote));

        return quotes;
    } catch (error) {
        console.error('Error fetching common quotes:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch common quotes'
        });
    }
});
