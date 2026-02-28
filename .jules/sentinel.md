## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - IDOR in Object Storage (S3/R2)
**Vulnerability:** Document uploads, lists, and downloads were vulnerable to Insecure Direct Object References (IDOR). Uploaded files were stored in a flat `documents/` directory with a timestamp, allowing any authenticated user to potentially guess a key or use the `list` endpoint to find and access documents uploaded by other users.
**Learning:** Object storage lacks native user-based access control when accessed via a unified backend client. Relying solely on `requireAuth` is insufficient if the specific resource being accessed isn't validated against the requesting user's identity.
**Prevention:** Always scope user-uploaded files into directories based on their unique identifier (e.g., `documents/users/${uid}/`). Enforce this prefix on `list` operations, and validate that requested keys for `download` operations match the authenticated user's scope.
