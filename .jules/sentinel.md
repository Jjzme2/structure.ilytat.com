## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-08 - Insecure Direct Object Reference (IDOR) in R2 Document Storage
**Vulnerability:** Users could list and download documents belonging to other users due to a flat storage structure `documents/` without explicit ownership checks.
**Learning:** Storing all user files in a single flat namespace without server-side validation during `list` and `download` operations directly leads to IDOR vulnerabilities. `requireAuth` only authenticates the user, it does not authorize the user to access specific paths.
**Prevention:** Always namespace file storage by user context (e.g., `documents/users/${user.uid}/`) when uploading. During retrieval (`list` or `download`), strictly validate that the requested resource path matches the authenticated user's namespace, unless they possess administrative privileges (`checkIsAdmin`).