import { S3Client } from '@aws-sdk/client-s3'

// Initialize the S3 Client for Cloudflare R2
// Credentials should be in .env
const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT || `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'docs'

console.info(`[R2] Initializing client for bucket: ${bucket} at ${endpoint}`)

export const r2Client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || ''
    }
})

export const R2_BUCKET = bucket
