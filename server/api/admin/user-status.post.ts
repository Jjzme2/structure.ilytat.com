import { getAuth } from 'firebase-admin/auth'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const requester = await requireAuth(event)
    const auth = getAuth()
    const body = await readBody(event)

    const { uid, disabled } = body

    if (uid === undefined || disabled === undefined) {
        throw createError({ statusCode: 400, statusMessage: 'UID and disabled status are required' })
    }

    // Verify requester is admin
    if (requester.email !== 'jj@ilytat.com' && requester.email !== 'admin@ilytat.com' && requester.email !== 'zettler.jj@ilytat.com') {
        const token = await auth.verifyIdToken((requester as any).uid || requester.uid)
        if (!token.admin && token.role !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
        }
    }

    try {
        await auth.updateUser(uid, { disabled })

        const user = await auth.getUser(uid)
        const status = disabled ? 'disabled' : 'enabled'

        return {
            success: true,
            message: `User ${user.email} has been ${status}`,
            uid
        }

    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update user status: ' + e.message
        })
    }
})
