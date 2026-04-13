## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - IDOR in Document Operations
**Vulnerability:** Document upload, list, and download APIs were not scoped to the authenticated user, allowing any authenticated user to upload to arbitrary paths, list all documents in the bucket, and download any document.
**Learning:** Authenticating a request (e.g., via `requireAuth`) is not enough. Access to resources must be authorized based on ownership. Flat object storage structures (like S3/R2) require prefix scoping to enforce ownership, as they lack built-in directory-level access controls.
**Prevention:** Always scope resource identifiers (like S3/R2 keys) using the authenticated user's ID (e.g., `documents/users/${uid}/`). Enforce this prefix explicitly during uploads, lists, and downloads. For listing, use the `Delimiter: '/'` option if applicable to restrict listing scope.
