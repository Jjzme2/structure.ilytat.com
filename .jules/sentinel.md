## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - IDOR in S3/R2 Document Storage
**Vulnerability:** Document `upload`, `download`, and `list` handlers lacked tenant isolation, allowing users to guess or iterate through keys to access files belonging to other users (Insecure Direct Object Reference).
**Learning:** Cloud object storage (like S3/R2) provides a flat namespace by default. Enforcing user-level isolation requires explicitly structuring object keys with user IDs (e.g., `documents/users/${uid}/...`) and enforcing ownership validation on every read/write action at the application level.
**Prevention:** Always scope user-uploaded files to their specific UID in the object key structure. Enforce this prefix server-side for all storage API interactions (`PutObject`, `GetObject`, `ListObjectsV2`) using the authenticated user's token. Support legacy fallback selectively if backward compatibility is strictly required, but document the accepted risk.
