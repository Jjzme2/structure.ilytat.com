## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-03-18 - Insecure Direct Object Reference (IDOR) in Documents API
**Vulnerability:** Document upload, list, and download endpoints lacked proper scoping, allowing any authenticated user to potentially list and download documents belonging to other users.
**Learning:** Checking general authentication (`requireAuth`) is insufficient for resource-specific operations. When dealing with user-owned objects (like documents or files), the resource keys must be inherently bound to the user's identity to prevent unauthorized access.
**Prevention:** Always bind user-owned resources to their `uid` in the storage key structure (e.g., `documents/users/${uid}/...`). For list and download operations, strictly validate that the requested resource path belongs to the currently authenticated user (or ensure they have an explicit admin role) before interacting with the storage layer.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.
