## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2024-05-18 - Missing Email Verification Check in Hardcoded Admin Auth
**Vulnerability:** The `requireAdmin` function granted admin access to accounts with hardcoded email addresses (like `admin@ilytat.com`) without verifying if the user actually owned the email address (`email_verified: true`). This could allow an attacker to create an unverified Firebase account with an admin email and gain unauthorized access.
**Learning:** When using identity providers like Firebase Auth and authorizing based on hardcoded or custom email lists, it is crucial to explicitly verify `user.email_verified === true` on the decoded token.
**Prevention:** Always verify `user.email_verified === true` when granting privileges based on email claims to prevent account takeover from maliciously created unverified accounts.
