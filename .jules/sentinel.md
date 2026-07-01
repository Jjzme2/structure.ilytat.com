## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Email Verification Bypass
**Vulnerability:** Authorization logic (`requireAdmin` and tenant member checks) relied solely on the `email` claim from Firebase without verifying `email_verified: true` (or `emailVerified` on `UserRecord`), allowing account takeover via maliciously created unverified accounts matching hardcoded/whitelisted domains.
**Learning:** Identity providers like Firebase allow users to create accounts with any email address. If an application grants privileges based on the email address without checking if the user actually owns it (via `email_verified`), it introduces a critical authorization bypass vulnerability.
**Prevention:** Always explicitly check `user.email_verified === true` (or `user.emailVerified` depending on the object) when granting permissions or data access based on email addresses.
