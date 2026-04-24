import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const auth = await requireAuth(event)

    try {
        const [legacyRes, scopedRes] = await Promise.all([
            r2Client.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: 'documents/', Delimiter: '/' })),
            r2Client.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: `documents/users/${auth.uid}/` }))
        ])

        const contents = [...(legacyRes.Contents || []), ...(scopedRes.Contents || [])]

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
