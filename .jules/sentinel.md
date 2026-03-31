## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-08 - Insecure Direct Object Reference (IDOR) in Documents API
**Vulnerability:** Documents could be accessed by any authenticated user if they knew or guessed the file key, because the `download.get.ts` endpoint did not verify ownership of the document. Uploads were stored in a flat `documents/` directory.
**Learning:** When storing sensitive user files without a database mapping, the storage hierarchy itself must enforce ownership (e.g., scoping prefixes to user IDs).
**Prevention:** Ensure uploads are scoped to user-specific prefixes (`documents/users/${uid}/`) and that download endpoints explicitly verify the authenticated user matches the requested object's path.
