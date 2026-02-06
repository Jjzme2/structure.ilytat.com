import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    await requireAuth(event)

    try {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            // Prefix: 'documents/' // Optional: if we want to organize in a folder
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
