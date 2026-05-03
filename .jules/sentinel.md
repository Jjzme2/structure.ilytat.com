## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2024-05-03 - Unverified Account Takeover via Hardcoded Admin Emails
**Vulnerability:** The `requireAdmin` utility granted admin access to hardcoded emails without checking `email_verified` on the Firebase token, allowing malicious users to create unverified Firebase accounts with admin emails to gain unauthorized access.
**Learning:** Firebase allows account creation without immediate email verification. Authorizing based purely on email address without verifying ownership (`email_verified: true`) creates a critical account takeover vulnerability.
**Prevention:** Always validate `email_verified` when making authorization decisions based on email addresses from identity providers that do not enforce verification at signup.
