## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - IDOR in Document Access
**Vulnerability:** Document upload and download APIs allowed users to access other users' documents (IDOR). Uploads were placed in a common prefix `documents/` without user scoping, and downloads didn't verify ownership. List endpoint returned all documents.
**Learning:** Checking `requireAuth` is not enough if it doesn't enforce authorization to the specific resource. Flat storage requires structural access control, like folder prefixes.
**Prevention:** Architectural Rule: To prevent IDOR, document uploads MUST be scoped to `documents/users/${uid}/`. The `list` endpoint MUST filter results by this prefix, and `download` MUST enforce ownership checks by verifying `key.startsWith(\`documents/users/${uid}/\`)`.
