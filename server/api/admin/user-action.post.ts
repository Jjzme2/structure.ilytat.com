import { getAuth } from 'firebase-admin/auth'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const requester = await requireAuth(event)
    const auth = getAuth()
    const body = await readBody(event)

    const { uid, action } = body

    if (!uid || !action) {
        throw createError({ statusCode: 400, statusMessage: 'UID and action are required' })
    }

    // Verify requester is admin (copying logic from invite.post.ts)
    if (requester.email !== 'jj@ilytat.com' && requester.email !== 'admin@ilytat.com' && requester.email !== 'zettler.jj@ilytat.com') {
        const token = await auth.verifyIdToken((requester as any).uid || requester.uid)
        if (!token.admin && token.role !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
        }
    }

    try {
        const user = await auth.getUser(uid)

        if (action === 'send-reset-email') {
            const link = await auth.generatePasswordResetLink(user.email!)
            // In a real app, we'd send this via a server-side email service.
            // For now, we return it to the admin or log it.
            console.log(`[Admin] Generated reset link for ${user.email}: ${link}`)
            return {
                success: true,
                message: `Password reset link generated for ${user.email}`,
                link // Returning link so admin can provide it if needed, or for debug
            }
        }

        if (action === 'force-reset') {
            // Set a custom claim that the client can check to force a reset
            const currentClaims = user.customClaims || {}
            await auth.setCustomUserClaims(uid, {
                ...currentClaims,
                forcePasswordReset: true
            })

            // Also generate a link anyway to be helpful
            const link = await auth.generatePasswordResetLink(user.email!)

            return {
                success: true,
                message: `User ${user.email} flagged for mandatory password reset`,
                link
            }
        }

        if (action === 'clear-reset-flag') {
            const currentClaims = user.customClaims || {}
            const { forcePasswordReset, ...remainingClaims } = currentClaims
            await auth.setCustomUserClaims(uid, remainingClaims)

            return {
                success: true,
                message: `Password reset flag cleared for ${user.email}`
            }
        }

        throw createError({ statusCode: 400, statusMessage: 'Invalid action' })

    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to perform user action: ' + e.message
        })
    }
})
