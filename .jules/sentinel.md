## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-03-24 - IDOR in S3 Document APIs
**Vulnerability:** Document upload, list, and download endpoints lacked tenant isolation, allowing users to interact with any document across the system.
**Learning:** Checking for authentication (`requireAuth`) does not inherently grant authorization. A global, flat S3 namespace (`documents/`) inherently exposes resources across tenants.
**Prevention:** Always scope S3 objects and prefixes to an authenticated user's ID (`documents/users/${user.uid}/`) and explicitly validate that requests target these isolated prefixes to prevent Insecure Direct Object Reference (IDOR).
