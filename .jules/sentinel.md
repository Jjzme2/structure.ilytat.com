## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - IDOR in S3 Documents
**Vulnerability:** The application allowed IDOR vulnerabilities in S3 object access because files were stored in a flat structure (`documents/`) instead of being scoped by user ID.
**Learning:** Migrating flat S3 object structures to user-scoped prefixes to prevent IDOR cannot securely support backward compatibility without a database mapping, because verifying ownership of legacy objects during list/download operations is impossible without exposing them to all authenticated users.
**Prevention:** Always scope document uploads to user-specific prefixes (e.g. `documents/users/${uid}/`) from the beginning, and enforce ownership checks based on this prefix.
