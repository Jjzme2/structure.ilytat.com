## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-04-23 - Prevent IDOR with User-Scoped S3 Prefixes
**Vulnerability:** Document S3 object keys were flat (`documents/...`), allowing any authenticated user to download any document by guessing its key, and lack of prefix filtering in listing allowed IDOR.
**Learning:** Migrating flat S3 object structures to user-scoped prefixes (`documents/users/${uid}/`) requires dual-query listing using `Delimiter: '/'` to securely support backward compatibility for legacy documents while strictly scoping new files.
**Prevention:** Always incorporate the user's authentication UID directly into storage prefixes and validate ownership on access.
