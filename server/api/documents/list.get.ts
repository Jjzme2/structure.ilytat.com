import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth, checkIsAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    try {
        const prefix = checkIsAdmin(user) ? 'documents/' : `documents/users/${user.uid}/`

        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: prefix
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
