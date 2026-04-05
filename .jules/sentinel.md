## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - IDOR in S3 Documents
**Vulnerability:** The documents API allowed any authenticated user to list and download any other user's uploaded documents because files were stored in a flat `documents/` structure and no ownership checks were performed.
**Learning:** Storing user-generated content in a flat S3 structure makes backward-compatible ownership verification impossible without a database mapping. Migrating to user-scoped prefixes (`documents/users/${uid}/`) prevents IDOR for new uploads but legacy objects remain accessible to all authenticated users unless explicitly blocked (which would break backward compatibility).
**Prevention:** Always scope user-uploaded S3/R2 objects with a user identifier in the key prefix (e.g., `documents/users/${uid}/`). In `list` and `download` APIs, enforce that the requesting user's `uid` matches the prefix, falling back to legacy keys only if backward compatibility is strictly required.
