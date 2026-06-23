## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2024-06-23 - Hardcoded Admin List Missing Email Verification
**Vulnerability:** The legacy `adminEmails` list in `server/utils/auth.ts` granted admin access purely based on the `user.email` claim from Firebase, without verifying if `user.email_verified === true`.
**Learning:** Hardcoded email whitelists in Firebase Auth must explicitly check `email_verified`. If they don't, an attacker could create an account with an admin's email and gain god-mode privileges before the real owner creates their account, as Firebase allows account creation without immediate email verification.
**Prevention:** Always include `user.email_verified === true` when validating authorization against email addresses from decoded tokens.
