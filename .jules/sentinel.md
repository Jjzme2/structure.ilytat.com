## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Information Leakage in API Errors
**Vulnerability:** Several API routes in `server/api/` were returning the raw `error.message` or `error.stack` inside HTTP 500 responses (e.g., `Failed to invite user: ${e.message}`).
**Learning:** Returning unhandled exception messages to clients exposes internal state, DB details, or unexpected data. It is easy for this pattern to proliferate in server endpoints by mistake when using `createError`.
**Prevention:** Do not expose internal `e.message` or `e.stack` strings to clients in HTTP responses. Always log these errors server-side with `console.error` and return a generic error message (like "Internal Server Error" or "Failed to list users") to the client.
