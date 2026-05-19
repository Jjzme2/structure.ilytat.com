## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2026-05-19 - Missing email_verified check on Firebase Auth hardcoded email admin auth
**Vulnerability:** Admin endpoints (`requireAdmin` in `server/utils/auth.ts`) checked `user.email` against a hardcoded list of admin emails without verifying `user.email_verified === true`.
**Learning:** In Firebase Auth, a user can create an account with any unverified email address unless specifically restricted. An attacker could create an account with an admin's email and bypass the check if verification isn't enforced on the token.
**Prevention:** Always verify `user.email_verified === true` on the DecodedIdToken when authorizing users based on email address.
