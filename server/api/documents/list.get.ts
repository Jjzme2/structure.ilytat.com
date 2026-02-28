import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth, requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    // Check if admin
    let isAdmin = false
    try {
        await requireAdmin(event)
        isAdmin = true
    } catch (e) {
        // Not an admin
    }

    try {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            // Security: IDOR Prevention - Scoped listing for non-admins
            Prefix: isAdmin ? 'documents/' : `documents/users/${user.uid}/`
        })

        const response = await r2Client.send(command)

        return response.Contents?.map(item => ({
            key: item.Key,
            size: item.Size,
            lastModified: item.LastModified
        })) || []

    } catch (error: any) {
        console.error('R2 List Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to list documents'
        })
    }
})
