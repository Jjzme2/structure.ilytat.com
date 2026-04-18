## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-04-18 - IDOR in S3/R2 Document Storage
**Vulnerability:** Document upload, list, and download APIs allowed users to interact with any files under the `documents/` prefix, leading to Insecure Direct Object References (IDOR).
**Learning:** Flat S3 object structures do not inherently provide tenant or user isolation. Relying on application-level file name obfuscation is insufficient security against IDOR.
**Prevention:** Always enforce logical isolation by using user-scoped prefixes (e.g., `documents/users/${uid}/`) in S3 keys for upload, and strictly validate the prefix on list and download operations.
