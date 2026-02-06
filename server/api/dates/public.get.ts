import { getFirestore } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
    try {
        const db = getFirestore();
        const datesRef = db.collection('dates');

        // Fetch public dates
        // Removed orderBy on server to avoid requiring a composite index for now
        // Sorting will be handled by the client or simplified here
        const snapshot = await datesRef
            .where('isPublic', '==', true)
            .limit(20)
            .get();

        const publicEvents = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data
            };
        });

        // Sort in memory for immediate results
        publicEvents.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return publicEvents;
    } catch (error: any) {
        console.error('CRITICAL: Failed to fetch public dates:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        throw createError({
            statusCode: 500,
            statusMessage: `Internal Server Error: ${error.message || 'Unknown error'}`,
        });
    }
});
