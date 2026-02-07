import { GetObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET } from '../../utils/r2'
import { Readable } from 'stream'
import mime from 'mime-types'

export default defineEventHandler(async (event) => {
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

        const disposition = isInline ? 'inline' : 'attachment'

        // Handle Content-Disposition
        // If inline is requested, we force inline. Otherwise we default to attachment to ensure download.
        setHeader(event, 'Content-Disposition', disposition)

        // Stream the body
        // response.Body is a readable stream in Node
        return response.Body as Readable

    } catch (error: any) {
        console.error('R2 Download Error:', error)
        throw createError({
            statusCode: 404,
            statusMessage: 'File not found or access denied'
        })
    }
})
