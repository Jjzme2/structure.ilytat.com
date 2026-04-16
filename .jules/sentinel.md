## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2026-04-16 - IDOR in Cloud Storage Objects
**Vulnerability:** Document uploads and lists were using a flat structure `documents/`, allowing any authenticated user to potentially list or download other users' files by guessing or enumerating keys.
**Learning:** When using flat object storage like S3/R2, logical isolation must be implemented via key prefixes (e.g., `documents/users/${uid}/`) and strictly enforced on all list and get operations, as bucket-level IAM policies are often too broad or unused in simple setups.
**Prevention:** Always scope user-uploaded files to a user-specific prefix upon upload, enforce that prefix in listing operations (using `Prefix` and `Delimiter`), and validate the requested key prefix against the authenticated user's ID during download operations.
