## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2024-05-24 - Unverified Admin Email Hijacking
**Vulnerability:** Hardcoded admin emails bypass role checks but did not verify `email_verified: true` on the decoded token, allowing attackers to hijack admin access by registering an unverified account with an admin's email.
**Learning:** Identity providers like Firebase Auth allow users to register with any email address. Authorization decisions based purely on the `email` claim are vulnerable if the email owner hasn't verified their identity.
**Prevention:** Always explicitly verify `email_verified === true` when making authorization decisions based on custom/hardcoded email addresses.
