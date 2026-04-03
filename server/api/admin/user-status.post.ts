import { getAuth } from 'firebase-admin/auth'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const requester = await requireAdmin(event)
    const auth = getAuth()
    const body = await readBody(event)

    const { uid, disabled } = body

    if (uid === undefined || disabled === undefined) {
        throw createError({ statusCode: 400, statusMessage: 'UID and disabled status are required' })
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
        console.error('Failed to update user status', e)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update user status'
        })
    }
})
