import { GetObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { requireAuth } from '../../utils/auth'
import { Readable } from 'stream'
import mime from 'mime-types'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
    // Verify authentication
    const auth = await requireAuth(event)

    const query = getQuery(event)
    const key = query.key as string

    if (!key) {
        throw createError({
            statusCode: 400,
            statusMessage: 'File key is required'
        })
    }

    const isInline = query.inline === 'true'

    try {
        const command = new GetObjectCommand({
            Bucket: R2_BUCKET,
            Key: key
        })

        const response = await r2Client.send(command)

        if (!response.Body) {
            throw new Error('No body returned from R2')
        }

        // Determine Content Type
        let contentType = response.ContentType

        if (!contentType || contentType === 'application/octet-stream') {
            contentType = mime.lookup(key) || 'application/octet-stream'
        }

        if (contentType) {
            setHeader(event, 'Content-Type', contentType)
        }

        if (response.ContentLength) {
            setHeader(event, 'Content-Length', response.ContentLength)
        }

        const filename = key.split('/').pop() || 'document'
        const disposition = isInline ? 'inline' : `attachment; filename="${filename}"`

        // Handle Content-Disposition
        setHeader(event, 'Content-Disposition', disposition)

        // Log the download action
        try {
            const db = getFirestore()
            await db.collection('activities').add({
                action: 'document_download',
                module: 'documents',
                userId: (auth as any).uid, // auth is the decoded token
                timestamp: FieldValue.serverTimestamp(),
                metadata: {
                    key,
                    filename,
                    ip: getRequestIP(event, { xForwardedFor: true }),
                    userAgent: getHeader(event, 'user-agent'),
                    disposition
                }
            })
        } catch (logError) {
            console.error('Failed to log document download:', logError)
            // Don't fail the download if logging fails
        }

        // Stream the body
        // response.Body is a readable stream in Node environments
        return response.Body as Readable

    } catch (error: any) {
        console.error('R2 Download Error:', error)
        if (error.name === 'NoSuchKey') {
            throw createError({
                statusCode: 404,
                statusMessage: 'File not found'
            })
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to retrieve document'
        })
    }
})
