## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2024-05-28 - Require Email Verification for Hardcoded Admins
**Vulnerability:** The `requireAdmin` logic authorized users based purely on if their token's `email` matched a hardcoded whitelist, without checking `email_verified`. This meant anyone could create an unverified Firebase Auth account using an admin's email and gain full admin access.
**Learning:** Hardcoded email checks in identity providers (like Firebase) bypass the provider's built-in verification flow if not explicitly checked in code. An `email` claim is not proof of ownership unless `email_verified` is true.
**Prevention:** Always include an explicit `user.email_verified === true` check when implementing authorization that relies on an email address claim, rather than just matching strings.
