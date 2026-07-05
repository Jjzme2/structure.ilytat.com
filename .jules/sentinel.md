## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Insecure Legacy Admin Check
**Vulnerability:** Authorization bypass. `server/utils/auth.ts` granted admin privileges strictly by verifying if a token's email matched a hardcoded list, without ensuring that `email_verified` was true.
**Learning:** Hardcoded email checks or list-based access must ALWAYS verify ownership of the email. A malicious user can create a new, unverified account with any email address using Identity Providers (like Firebase or Auth0) and gain unauthorized access if `email_verified: true` is not asserted.
**Prevention:** Always include `user.email_verified === true` alongside email address checks in authorization boundaries to prevent account takeover via unverified signups.
