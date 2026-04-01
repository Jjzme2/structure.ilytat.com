## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Insecure Direct Object Reference (IDOR) in S3 Documents
**Vulnerability:** S3 documents lacked user-level scoping, allowing any authenticated user to list and download documents belonging to others by guessing their keys.
**Learning:** Relying solely on a flat object storage structure without folder prefixes derived from user IDs creates a global namespace where authorization checks on individual objects become difficult without a database mapping.
**Prevention:** Always scope user uploads to a prefix containing their unique user ID (e.g., `documents/users/${uid}/`). When fetching or downloading, enforce that the requested prefix matches the authenticated user's ID.
