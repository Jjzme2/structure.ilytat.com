import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    try {
        // Query user-specific documents
        const userCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: `documents/users/${user.uid}/`
        })
        const userResponse = await r2Client.send(userCommand)

        // Query legacy documents (excluding other users' directories)
        const legacyCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: 'documents/',
            Delimiter: '/'
        })
        const legacyResponse = await r2Client.send(legacyCommand)

        // Combine contents
        const allContents = [
            ...(userResponse.Contents || []),
            ...(legacyResponse.Contents || [])
        ]

        return allContents.map(item => ({
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
