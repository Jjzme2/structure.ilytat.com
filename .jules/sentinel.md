## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2024-05-24 - Admin Email Verification Bypass
**Vulnerability:** The `requireAdmin` authorization check relied on `user.email` matching a hardcoded list without verifying `user.email_verified === true`.
**Learning:** When using identity providers like Firebase, malicious actors can create unverified accounts using arbitrary email addresses (like admin emails). If authorization only checks the `email` string and not `email_verified`, they can bypass access controls.
**Prevention:** Always explicitly verify `user.email_verified === true` on decoded auth tokens when using email addresses for authorization logic, especially for hardcoded or legacy lists.
