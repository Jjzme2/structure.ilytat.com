## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Unverified Email Authorization Bypass
**Vulnerability:** The `requireAdmin` auth utility granted administrative access to users if their decoded token email matched a hardcoded whitelist, without verifying `email_verified === true`. An attacker could create a Firebase Auth account using a whitelisted email (e.g. admin@ilytat.com) before the real owner does, or use a provider that doesn't verify emails, to gain unauthorized admin access.
**Learning:** Identity providers like Firebase allow users to claim any email address during sign-up. Authorization logic must explicitly confirm the user proved ownership of that email via the `email_verified` claim.
**Prevention:** Always verify `user.email_verified === true` when authorizing based on hardcoded or custom email lists using identity providers.
