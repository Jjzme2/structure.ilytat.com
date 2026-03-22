## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - IDOR in Document Upload, List and Download
**Vulnerability:** Document APIs (`upload.post.ts`, `list.get.ts`, `download.get.ts`) were not scoped to the authenticated user, allowing IDOR. Users could upload to a global namespace, list all user documents, or download any document if they guessed or knew the key.
**Learning:** Checking for authentication (`requireAuth`) is necessary but not sufficient for authorization. The application must verify that the authenticated user actually owns or has permission to access the specific resource being requested. In object storage without built-in ACLs per object tied to our auth system, the folder structure (e.g. scoping to `users/${uid}/`) is the boundary.
**Prevention:** Always scope uploads to a user-specific directory (e.g., `documents/users/${uid}/`). Filter list requests using this prefix. Validate download requests by enforcing that the requested `key` starts with the authorized user's prefix before serving the file.
