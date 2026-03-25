## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-03-25 - IDOR in S3 Uploads and Downloads
**Vulnerability:** `server/api/documents/upload.post.ts` and `server/api/documents/list.get.ts` allowed users to upload files to a shared `documents/` prefix and list all objects.
**Learning:** By not scoping objects to a user-specific prefix, users could potentially overwrite other users' files or discover files belonging to other users. Also, download endpoints without ownership checks are vulnerable to IDOR (Insecure Direct Object Reference) even if path traversal is mitigated.
**Prevention:** Always scope uploads to user-specific prefixes (e.g. `documents/users/${uid}/`) to enforce boundaries. Then, enforce ownership checks in download APIs by ensuring requested keys begin with the authenticated user's prefix.
