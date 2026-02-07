import { getAuth } from 'firebase-admin/auth'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const requester = await requireAuth(event)
    const auth = getAuth()
    const body = await readBody(event)

    const { email, role = 'member' } = body

    if (!email) {
        throw createError({ statusCode: 400, statusMessage: 'Email is required' })
    }

    // Verify requester is admin
    if (requester.email !== 'jj@ilytat.com' && requester.email !== 'admin@ilytat.com' && requester.email !== 'zettler.jj@ilytat.com') {
        const token = await auth.verifyIdToken((requester as any).uid || requester.uid)
        if (!token.admin && token.role !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
        }
    }

    try {
        let userRecord
        let isNewUser = false

        try {
            userRecord = await auth.getUserByEmail(email)
        } catch (e: any) {
            if (e.code === 'auth/user-not-found') {
                // Create new user
                userRecord = await auth.createUser({
                    email,
                    emailVerified: true, // Auto-verify for invited users? Or force verification?
                    // password: 'tempPassword123!' // Optional temporary password
                })
                isNewUser = true
            } else {
                throw e
            }
        }

        // Set Custom Claims
        await auth.setCustomUserClaims(userRecord.uid, {
            tenantId: 'ilytat',
            role: role
        })

        // TODO: Send invitation email (e.g. via EmailJS or SendGrid)
        // For now, just logging
        console.log(`Invited user ${email} with role ${role}. New User: ${isNewUser}`)

        return {
            success: true,
            message: `User ${email} invited successfully`,
            uid: userRecord.uid,
            isNewUser
        }

    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to invite user: ' + e.message
        })
    }
})
