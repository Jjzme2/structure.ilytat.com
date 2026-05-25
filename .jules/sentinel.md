## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Insecure Admin Authorization via Unverified Emails
**Vulnerability:** `requireAdmin` authorized users based on an explicit whitelist of admin emails without verifying if the email was actually owned by the user (`user.email_verified`). An attacker could create a new account with an admin email using a provider that doesn't verify emails by default (like password auth) and bypass authorization.
**Learning:** Checking `user.email` alone is insufficient when authorizing privileges using Identity Providers like Firebase Auth, as unverified accounts can claim any email address.
**Prevention:** Always enforce `user.email_verified === true` when making authorization decisions based on email addresses.
