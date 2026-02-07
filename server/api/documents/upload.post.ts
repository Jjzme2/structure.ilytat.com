import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // xlsx
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

        // Security: Validate File Type
        if (!ALLOWED_MIME_TYPES.includes(file.type || '')) {
             throw createError({
                statusCode: 400,
                statusMessage: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
            })
        }

        // Security: Validate File Size
        if (file.data.length > MAX_FILE_SIZE) {
            throw createError({
                statusCode: 400,
                statusMessage: `File too large: ${file.filename}. Max size is 5MB.`
            })
        }

        // Security: Sanitize Filename
        // Allow alphanumeric, dots, dashes, underscores only.
        const sanitizedFilename = file.filename.replace(/[^a-zA-Z0-9.\-_]/g, '-').toLowerCase()
        const key = `documents/${Date.now()}-${sanitizedFilename}`

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
