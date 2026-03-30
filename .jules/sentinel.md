## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Insecure Direct Object Reference (IDOR) in Documents API
**Vulnerability:** Document upload and list/download APIs did not scope access to specific users, allowing any authenticated user to list and download documents belonging to other users.
**Learning:** Returning all objects in S3/R2 by default without a user-scoped prefix or database-level mapping leaves user data exposed. Client-side hiding is insufficient security.
**Prevention:** Always enforce resource ownership on the backend. Scope S3/R2 object keys to include the authenticated user ID (`documents/users/${uid}/`), and validate that the requested key's UID matches the currently authenticated user before fulfilling the request. Ensure list operations use this scoped prefix.
