## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2024-05-02 - Account Takeover via Unverified Admin Email
**Vulnerability:** `requireAdmin` granted admin privileges based solely on matching a hardcoded email string, allowing an attacker to gain admin access by signing up with an unverified admin email.
**Learning:** Checking an email address for authorization without verifying its ownership (`email_verified: true`) creates a severe account takeover risk, especially for hardcoded God-mode lists.
**Prevention:** Always validate `user.email_verified === true` when making authorization decisions based on email addresses from identity providers that allow unverified sign-ups.
