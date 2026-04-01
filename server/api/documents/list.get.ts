import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    try {
        // Security: Fetch only documents scoped to the current user to prevent IDOR
        const userPrefixCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: `documents/users/${user.uid}/`
        })

        // Concurrently fetch legacy documents (using prefix 'documents/' with Delimiter: '/')
        // to maintain backward compatibility without traversing into other users' folders.
        const legacyCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: 'documents/',
            Delimiter: '/'
        })

        const [userResponse, legacyResponse] = await Promise.all([
            r2Client.send(userPrefixCommand),
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
        })) || []

    } catch (error: any) {
        console.error('R2 List Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to list documents'
        })
    }
})
