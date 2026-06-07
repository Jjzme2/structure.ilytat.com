## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2025-03-01 - Prevent Account Takeover via Unverified Emails
**Vulnerability:** Hardcoded admin email checks in `requireAdmin` did not verify if the email address was actually verified (`email_verified === true`).
**Learning:** Identity providers like Firebase allow users to create accounts with any email address (even those they don't own) before verification. If authorization logic relies solely on matching the `user.email` string without checking verification status, a malicious user can create an account using an admin's email and gain unauthorized access.
**Prevention:** Always explicitly check `user.email_verified === true` on the decoded token when authorizing users based on custom or hardcoded email lists.
