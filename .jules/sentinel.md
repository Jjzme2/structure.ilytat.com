## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Document Storage IDOR via Path Traversal/Unscoped Keys
**Vulnerability:** Document APIs (`upload`, `list`, `download`) relied on a shared `documents/` S3 prefix without validating ownership, enabling users to upload over, list, and download other users' documents.
**Learning:** Using authenticated endpoints alone is insufficient if the requested resource's ownership isn't explicitly checked against the authenticated context (Insecure Direct Object Reference).
**Prevention:** Always scope user resources (like S3 keys) using their unique identifier (e.g., `documents/users/${uid}/`). Enforce this prefix on uploads, restrict listing strictly to the scoped prefix (and global shared ones, if applicable), and validate that downloaded keys begin with the user's explicit prefix or shared/legacy prefixes to prevent unauthorized access to peers' data.
