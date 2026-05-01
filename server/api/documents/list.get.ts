import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const auth = await requireAuth(event)

    try {
        // Keep fetching everything in the bucket that isn't scoped
        const legacyCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET
        })

        const scopedCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: `documents/users/${(auth as any).uid}/`
        })

        const [legacyResponse, scopedResponse] = await Promise.all([
            r2Client.send(legacyCommand),
            r2Client.send(scopedCommand)
        ])

        // Filter out the "documents/users/" prefix from legacy to avoid duplicates or unauthorized items
        const legacyContents = (legacyResponse.Contents || []).filter(item => !item.Key?.startsWith('documents/users/'))
        const scopedContents = scopedResponse.Contents || []

        return [...legacyContents, ...scopedContents].map(item => ({
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
