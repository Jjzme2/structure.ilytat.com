import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const user = await requireAuth(event)

    // Read multipart form data
    const files = await readMultipartFormData(event)

    if (!files || files.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No file provided'
        })
    }

    const uploadedFiles = []

    for (const file of files) {
        if (!file.filename) continue

        // Basic sanitization
        const filename = file.filename.replace(/\s+/g, '-').toLowerCase()
        const key = `documents/${Date.now()}-${filename}` // Timestamp to avoid collisions

        try {
            const command = new PutObjectCommand({
                Bucket: R2_BUCKET,
                Key: key,
                Body: file.data,
                ContentType: file.type
            })

            await r2Client.send(command)

            uploadedFiles.push({
                key,
                filename: file.filename,
                size: file.data.length
            })

        } catch (error) {
            console.error('R2 Upload Error:', error)
            throw createError({
                statusCode: 500,
                statusMessage: `Failed to upload ${file.filename}`
            })
        }
    }

    return {
        success: true,
        files: uploadedFiles
    }
})
