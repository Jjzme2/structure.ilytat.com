## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2024-05-23 - Authorization Bypass via Unverified Emails
**Vulnerability:** Admin access could be granted to unverified users if their email matched the hardcoded legacy admin list. An attacker could create an account with an admin's email and gain full administrative privileges without verifying the email.
**Learning:** Firebase Auth allows users to create accounts with any email address, but sets `email_verified: false` until they prove ownership. Authorization checks relying solely on the `email` property in the decoded token are vulnerable.
**Prevention:** Always explicitly check `user.email_verified === true` when making authorization decisions based on email addresses.
