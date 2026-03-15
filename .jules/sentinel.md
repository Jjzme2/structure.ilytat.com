## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-03-15 - Information Leakage in API Error Responses
**Vulnerability:** Multiple `server/api/admin/` endpoints leaked internal error messages (e.g., `e.message`) to the client via HTTP 500 response `statusMessage`.
**Learning:** Concatenating raw error objects or their messages into `createError` exposes internal backend details, which attackers can use to map the system architecture or identify specific unhandled exceptions.
**Prevention:** Always catch exceptions and log them server-side using `console.error` (or a logging library), and return generic, non-descriptive error messages (e.g., "Failed to complete action") to the client via `createError`.
