## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Unverified Email Bypass in Admin Auth
**Vulnerability:** `requireAdmin` permitted access to admin endpoints by merely checking if the `user.email` matched a hardcoded list, without verifying `user.email_verified === true`. This could allow a malicious user to create an unverified account with an admin's email to gain unauthorized access.
**Learning:** When using identity providers, the presence of an email address on the token is insufficient for authorization if the email hasn't been verified to belong to the user.
**Prevention:** Always explicitly check `user.email_verified === true` when making authorization decisions based on email addresses.
