import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth, ADMIN_EMAILS } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    await requireAuth(event)

    try {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET,
            // Prefix: 'documents/' // Optional: if we want to organize in a folder
        })

        const response = await r2Client.send(command)

        const files = response.Contents?.map(item => ({
            key: item.Key,
            size: item.Size,
            lastModified: item.LastModified
        })) || []

        // Security: Filter files based on ownership
        return files.filter(file => {
            const key = file.key || ''

            // Check if file is in a user folder
            if (key.startsWith('documents/users/')) {
                const pathParts = key.split('/')
                const ownerId = pathParts[2]

                // Allow if current user is owner
                if (ownerId === auth.uid) return true

                // Allow if admin
                const isAdmin = (auth.admin === true || auth.role === 'admin') || (auth.email && ADMIN_EMAILS.includes(auth.email))

                return isAdmin
            }

            // Allow other files (root level or non-user folders)
            return true
        })

    } catch (error: any) {
        console.error('R2 List Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to list documents'
        })
    }
})
