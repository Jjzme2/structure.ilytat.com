## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Account Takeover via Unverified Admin Emails
**Vulnerability:** The `requireAdmin` authorization middleware checked if a user's email was in a hardcoded list of admin emails (`jj@ilytat.com`, etc.) without verifying that the user actually owned the email address (`email_verified` was not checked).
**Learning:** Any user could create an unverified Firebase account using one of the hardcoded admin email addresses. Because the system only checked `user.email`, the attacker would instantly be granted "god mode" (admin access) without ever needing access to the admin's actual inbox.
**Prevention:** When authorizing based on email addresses using identity providers like Firebase Auth, ALWAYS explicitly check `user.email_verified === true` alongside the email matching logic to prevent account takeover via maliciously created unverified accounts.
