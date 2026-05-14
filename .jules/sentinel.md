## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2024-05-23 - Prevent Admin Account Takeover via Unverified Emails
**Vulnerability:** Authorization logic using hardcoded admin emails (`requireAdmin` in `server/utils/auth.ts`) allowed access based purely on the `email` claim in the JWT token without verifying if the email was actually verified (`email_verified: true`). This permitted maliciously created unverified accounts claiming to be admin emails to bypass authorization.
**Learning:** When using identity providers like Firebase Auth, and relying on email strings for authorization, it is critical to explicitly check the `email_verified` claim, because unverified accounts can easily be created with any email address.
**Prevention:** Always verify `user.email_verified === true` when asserting identity or privileges based on an email address claim from an identity provider.
