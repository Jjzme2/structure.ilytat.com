import { getAuth } from 'firebase-admin/auth'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const requester = await requireAuth(event)
    const auth = getAuth()

    // Verify requester is admin
    if (requester.email !== 'jj@ilytat.com' && requester.email !== 'admin@ilytat.com' && requester.email !== 'zettler.jj@ilytat.com') {
        const token = await auth.verifyIdToken((requester as any).uid || requester.uid)
        if (!token.admin && token.role !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
        }
    }

    try {
        // List all users (limit to 1000 for now)
        const listUsersResult = await auth.listUsers(1000)

        // Filter for ILYTAT tenant members
        const tenantUsers = listUsersResult.users.filter(user => {
            const claims = user.customClaims || {}
            return claims.tenantId === 'ilytat' ||
                claims.role === 'admin' ||
                claims.admin === true ||
                user.email?.endsWith('@ilytat.com') // Implicitly include domain users
        })

        return tenantUsers.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: (user.customClaims?.role as string) || 'member',
            lastSignInTime: user.metadata.lastSignInTime,
            creationTime: user.metadata.creationTime
        }))

    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to list users: ' + e.message
        })
    }
})
