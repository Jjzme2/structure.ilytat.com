## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Privilege Escalation via Unverified Legacy Emails
**Vulnerability:** The system granted admin access to hardcoded legacy admin emails without verifying if the user actually owned the email (`email_verified`). An attacker could create a new account using an admin's email and immediately gain "god mode" access.
**Learning:** Hardcoded email checks or allowlists must always be paired with a verification check from the identity provider (e.g., `user.email_verified === true` for Firebase Auth). Simply possessing an email claim in a decoded token does not guarantee ownership if the provider issues tokens before verification.
**Prevention:** Always explicitly check `email_verified: true` when making authorization decisions based on email addresses.
