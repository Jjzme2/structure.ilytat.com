import { getAuth } from 'firebase-admin/auth'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const requester = await requireAdmin(event)
    const auth = getAuth()

    try {
        // List all users (limit to 1000 for now)
        const listUsersResult = await auth.listUsers(1000)

        // Filter for ILYTAT tenant members
        const tenantUsers = listUsersResult.users.filter(user => {
            const claims = user.customClaims || {}
            return claims.tenantId === 'ilytat' ||
                claims.role === 'admin' ||
                claims.admin === true ||
                // Security: Implicitly include domain users only if their email is verified
                (user.email?.endsWith('@ilytat.com') && user.emailVerified === true)
        })

        return tenantUsers.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: (user.customClaims?.role as string) || 'member',
            lastSignInTime: user.metadata.lastSignInTime,
            creationTime: user.metadata.creationTime,
            disabled: user.disabled,
            forcePasswordReset: !!user.customClaims?.forcePasswordReset
        }))

    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to list users: ' + e.message
        })
    }
})
