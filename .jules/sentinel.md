## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
## 2024-05-15 - Fix Insecure Direct Object Reference (IDOR) in Document Storage
**Vulnerability:** Document uploads and listings were insecure. Uploads were stored in a flat S3 prefix without a user ID constraint, meaning any authenticated user could download any document if they could guess or find the key. The list endpoint did not enforce any ownership prefix check, exacerbating the problem.
**Learning:** By migrating away from flat structures and grouping documents under user-scoped object keys (e.g., `documents/users/${user.uid}/`), ownership is baked into the path itself. This forces list endpoints to natively filter by user constraints safely and prevents downloads without checking the prefix matching the token user's ID.
**Prevention:** Always define a scoping prefix containing a secure, verified user identifier (`user.uid`) for files uploaded directly to storage buckets instead of maintaining a flat hierarchy. Enforce prefix validation upon download attempts.
