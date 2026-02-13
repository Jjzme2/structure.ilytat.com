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

/**
 * Validates that the requester has admin privileges.
 * Checks for 'admin' role, 'admin' boolean claim, or specific legacy emails.
 * @param requester The decoded token object from requireAuth
 */
export const requireAdmin = (requester: any) => {
    // Legacy support: specific emails are always admins
    const legacyAdmins = ['jj@ilytat.com', 'admin@ilytat.com', 'zettler.jj@ilytat.com'];
    if (requester.email && legacyAdmins.includes(requester.email)) {
        return;
    }

    // Check for admin role or claim
    if (requester.admin === true || requester.role === 'admin') {
        return;
    }

    throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Admin access required',
    });
};
