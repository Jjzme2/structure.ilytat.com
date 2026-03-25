import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const auth = await requireAuth(event)

    try {
        // 1. Fetch user-specific files
        const userCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: `documents/users/${auth.uid}/` // Security: Prevent IDOR, scope list to user
        })
        const userResponse = await r2Client.send(userCommand)
        const userFiles = userResponse.Contents || []

        // 2. Fetch legacy files (backward compatibility)
        // Without a DB we can't map legacy files, so we return files in the root documents/ dir
        // This maintains the original system behavior for legacy files while securing new ones
        const legacyCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: 'documents/',
            Delimiter: '/' // Only get files directly in documents/, not subfolders
        })
        const legacyResponse = await r2Client.send(legacyCommand)
        const legacyFiles = legacyResponse.Contents || []

        const allFiles = [...userFiles, ...legacyFiles]

        return allFiles.map(item => ({
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
