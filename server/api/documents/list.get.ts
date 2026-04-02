import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const auth = await requireAuth(event)

    try {
        // Query both user-scoped files and legacy root files
        const [userDocsResponse, legacyDocsResponse] = await Promise.all([
            r2Client.send(new ListObjectsV2Command({
                Bucket: R2_BUCKET,
                Prefix: `documents/users/${(auth as any).uid}/`
            })),
            r2Client.send(new ListObjectsV2Command({
                Bucket: R2_BUCKET,
                Prefix: 'documents/',
                Delimiter: '/'
            }))
        ])

        const allContents = [
            ...(userDocsResponse.Contents || []),
            ...(legacyDocsResponse.Contents || [])
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
