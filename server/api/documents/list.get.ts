import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const auth = await requireAuth(event)

    try {
        // Fetch user-scoped documents
        const userCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: `documents/users/${auth.uid}/`
        })

        // Fetch legacy root documents
        const legacyCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: 'documents/',
            Delimiter: '/'
        })

        const [userResponse, legacyResponse] = await Promise.all([
            r2Client.send(userCommand),
            r2Client.send(legacyCommand)
        ])

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
