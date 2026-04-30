import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    try {
        // Fetch scoped documents for the current user
        const userDocsCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: `documents/users/${user.uid}/`
        })

        // Fetch legacy documents (backward compatibility)
        const legacyDocsCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: 'documents/',
            Delimiter: '/'
        })

        const [userDocsResponse, legacyDocsResponse] = await Promise.all([
            r2Client.send(userDocsCommand),
            r2Client.send(legacyDocsCommand)
        ])

        const contents = [
            ...(userDocsResponse.Contents || []),
            ...(legacyDocsResponse.Contents || [])
        ]

        return contents.map(item => ({
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
