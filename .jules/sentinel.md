## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Insecure Direct Object Reference (IDOR) in S3 Object Storage
**Vulnerability:** Document APIs (`upload`, `list`, `download`) allowed users to interact with any files under the `documents/` prefix because S3 object keys were not tied to user identity.
**Learning:** Even if path traversal is prevented (`..` checks) and users are authenticated (`requireAuth`), flat object storage can be vulnerable to IDOR if the object keys themselves are guessable and do not enforce ownership. A logged-in user could guess another user's filename and download it.
**Prevention:** Always namespace user-generated files in object storage using their unique identifier (e.g., `documents/users/${uid}/`). Enforce this prefix on all read (`ListObjectsV2`, `GetObject`) and write (`PutObject`) operations, explicitly validating access against the currently authenticated user's ID for non-administrative requests.
