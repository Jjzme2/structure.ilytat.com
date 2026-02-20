import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    try {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            // Prefix: 'documents/' // Optional: if we want to organize in a folder
        })

        const response = await r2Client.send(command)

        // Filter files to prevent IDOR:
        // 1. Show legacy files (not in 'documents/users/')
        // 2. Show files owned by the current user ('documents/users/{uid}/')
        const visibleFiles = response.Contents?.filter(item => {
            const key = item.Key || ''
            if (key.startsWith('documents/users/')) {
                return key.startsWith(`documents/users/${user.uid}/`)
            }
            return true // Legacy or other shared files
        }) || []

        return visibleFiles.map(item => ({
            key: item.Key,
            size: item.Size,
            lastModified: item.LastModified
        }))

    } catch (error: any) {
        console.error('R2 List Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to list documents'
        })
    }
})
