import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    try {
        // Request scoped files
        const scopedCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: `documents/users/${user.uid}/`
        })

        // Request legacy unscoped files (all files in `documents/` but we only want those not in `documents/users/`)
        const legacyCommand = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            Prefix: 'documents/',
            Delimiter: '/'
        })

        const [scopedResponse, legacyResponse] = await Promise.all([
            r2Client.send(scopedCommand),
            r2Client.send(legacyCommand)
        ])

        const scopedItems = scopedResponse.Contents || []

        // Filter legacy items to exclude anything in the users/ folder (which belongs to the new system)
        const legacyItems = (legacyResponse.Contents || []).filter(item => {
            return item.Key && !item.Key.startsWith('documents/users/')
        })

        const allItems = [...scopedItems, ...legacyItems]

        return allItems.map(item => ({
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
