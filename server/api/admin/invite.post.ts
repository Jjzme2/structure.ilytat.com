import { getAuth } from 'firebase-admin/auth'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const requester = await requireAdmin(event)
    const auth = getAuth()
    const body = await readBody(event)

    const { email, role = 'member' } = body

    if (!email) {
        throw createError({ statusCode: 400, statusMessage: 'Email is required' })
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
        console.error('Failed to invite user:', e)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to invite user'
        })
    }
})
