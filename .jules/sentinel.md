## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - IDOR in Flat S3 Object Storage
**Vulnerability:** Document uploads and lists were using a flat `documents/` prefix without user scoping, leading to Insecure Direct Object References (IDOR) where users could potentially guess keys or list files of others.
**Learning:** S3/R2 flat object structures require explicit prefixing (`documents/users/${uid}/`) to enforce secure access boundaries and prevent IDOR via API manipulation.
**Prevention:** Always scope uploads to user-specific prefixes. Use `Prefix` and `Delimiter` in list operations, and explicitly check ownership on download for newly scoped documents (while optionally allowing legacy bypass for backward compatibility).
