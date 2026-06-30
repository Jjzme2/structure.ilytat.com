## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2025-06-30 - Fix hardcoded admin email authorization bypass
**Vulnerability:** The `requireAdmin` function granted admin access to hardcoded emails without checking if the email was verified. A malicious user could create an account with an admin's email and bypass authorization.
**Learning:** Always verify `user.email_verified === true` when authorizing users based on hardcoded or custom email lists using identity providers like Firebase Auth to prevent account takeover from maliciously created unverified accounts.
**Prevention:** Explicitly check the `email_verified` property on the decoded token before trusting the email address for authorization decisions.
