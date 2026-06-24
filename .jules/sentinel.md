## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Path Traversal in S3 Downloads
**Vulnerability:** `server/api/documents/download.get.ts` allowed arbitrary file access by passing unvalidated `key` from query directly to `GetObjectCommand`.
**Learning:** Developers might assume S3 keys are safe from path traversal because object storage is flat, but client logic (like `filename` parsing or access control) can still be exploited using `..` or full paths if not validated. Also, relying on `requireAuth` is insufficient if it doesn't authorize access to the *specific* resource (IDOR).
**Prevention:** Always validate user-provided keys against an allowlist (e.g. alphanumeric + specific folders) and explicitly reject `..` traversal sequences before passing to storage APIs. Add `X-Content-Type-Options: nosniff` to prevent MIME confusion.

## 2026-02-07 - Information Disclosure in Server API Error Handlers
**Vulnerability:** Several backend API endpoints (`invite.post.ts`, `user-status.post.ts`, `user-action.post.ts`, `users.get.ts`, and `public.get.ts`) leaked internal error details (`e.message`) directly to the client via `createError` 500 responses.
**Learning:** Returning `e.message` or `error.message` on failed operations (like Firebase Admin commands or database queries) can expose sensitive internal state or infrastructure details to unauthorized users.
**Prevention:** Never pass internal error messages directly to the client in `createError` responses. Always log the detailed error server-side using `console.error` and return a generic `statusMessage` string to the client.
