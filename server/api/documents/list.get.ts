import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    try {
        // Fetch user-scoped documents
        const userCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: `documents/users/${user.uid}/`
        })

        // Fetch legacy documents (not scoped to any user, prevents orphaning)
        const legacyCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: 'documents/',
            Delimiter: '/' // Only fetch objects directly under 'documents/', ignore 'documents/users/...'
        })

        const [userResponse, legacyResponse] = await Promise.all([
            r2Client.send(userCommand),
            r2Client.send(legacyCommand)
        ])

        const userContents = userResponse.Contents || []
        const legacyContents = legacyResponse.Contents || []

        const allContents = [...userContents, ...legacyContents]

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
