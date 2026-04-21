## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2024-05-24 - IDOR Vulnerability in Document Management
**Vulnerability:** Document upload, list, and download endpoints lacked user isolation. All files were stored in a flat S3/R2 structure under `documents/`, allowing any authenticated user to list and download documents belonging to other users.
**Learning:** Using a flat S3 structure without a backend database mapping causes severe IDOR risks. While scoping documents to `documents/users/${uid}/` secures new files, enforcing this check creates a backwards-compatibility challenge. Legacy files must bypass the check, leaving older documents exposed.
**Prevention:** Always incorporate user IDs or tenant IDs into the S3 object prefix path (`namespace/users/${uid}/...`) from the start to securely isolate tenant data without relying on application-level DB mapping.
