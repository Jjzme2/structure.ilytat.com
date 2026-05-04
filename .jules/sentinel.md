## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2026-02-07 - Unverified Email Authorization Bypass
**Vulnerability:** `requireAdmin` allowed users with an email address on the hardcoded admin whitelist to gain access, even if they had not verified ownership of the email address.
**Learning:** When authorizing based on email address via identity providers like Firebase, malicious users can create accounts using someone else's email address. If the system does not explicitly check `email_verified === true`, it is susceptible to account takeover or unauthorized access.
**Prevention:** Always verify `user.email_verified === true` on the decoded token before trusting the `email` claim for authorization decisions.
