import { getAuth } from 'firebase-admin/auth';

export const requireAuth = async (event: any) => {
    let authHeader = getHeader(event, 'authorization');

    // Fallback to query parameter
    if (!authHeader) {
        const query = getQuery(event)
        if (query.token) {
            authHeader = `Bearer ${query.token}`
        }
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('requireAuth: Missing or invalid Authorization header');
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: Missing or invalid token',
        });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        return decodedToken;
    } catch (error: any) {
        console.error('requireAuth: Failed to verify token', error);
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: Invalid token',
        });
    }
};
