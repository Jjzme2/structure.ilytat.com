import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    try {
        // Security: Prevent IDOR by strictly scoping list to user's UID prefix
        const userPrefix = `documents/users/${user.uid}/`
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: userPrefix,
            Delimiter: '/' // Optional: prevent listing nested subdirectories if any exist
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
