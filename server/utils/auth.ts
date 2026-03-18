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

export const checkIsAdmin = (user: any) => {
    // Check hardcoded emails (legacy/god mode)
    // TODO: Migrate these users to use claims and remove hardcoded checks
    const adminEmails = ['jj@ilytat.com', 'admin@ilytat.com', 'zettler.jj@ilytat.com'];
    if (user.email && adminEmails.includes(user.email)) {
        return true;
    }

    // Check claims
    if (user.admin === true || user.role === 'admin') {
        return true;
    }

    return false;
}

export const requireAdmin = async (event: any) => {
    const user = await requireAuth(event);

    if (checkIsAdmin(user)) {
        return user;
    }

    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
}
