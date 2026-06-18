## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2025-02-20 - IDOR in S3 Documents Access
**Vulnerability:** S3 documents (files) were uploaded with a flat key structure (`documents/timestamp-filename`) and lacked access controls during download/list operations, allowing any authenticated user to view and download any other user's files if they knew or guessed the key (Insecure Direct Object Reference).
**Learning:** This existed because file metadata wasn't stored in the database, and access was purely reliant on authentication without authorization checks based on ownership. Migrating to user-scoped S3 prefixes (`documents/users/${uid}/...`) requires backward-compatibility logic so older documents don't instantly break since there's no DB mapping to assign them to their rightful owners retroactively.
**Prevention:** Always scope resource identifiers (like S3 keys or DB paths) to the user (`users/${uid}/resources/`) or store an explicit owner ID with the resource metadata. Validate ownership on every read/write operation.
