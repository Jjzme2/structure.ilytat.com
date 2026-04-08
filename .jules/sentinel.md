## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2024-04-08 - Prevent IDOR in Document Storage
**Vulnerability:** Document upload and download APIs allowed users to specify flat object keys without ownership verification, allowing an attacker to enumerate or access other users' documents.
**Learning:** When using object storage (S3/R2) without a database mapping, scoping objects by user ID prefix is necessary to enforce ownership natively. Migrating to user-scoped prefixes requires handling legacy files securely via specific filtering during lists and strict checks during downloads.
**Prevention:** Always scope user-uploaded files to `documents/users/${uid}/` prefixes and enforce this prefix constraint in all list and download operations.