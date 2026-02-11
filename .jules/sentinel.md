## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-08 - Marked XSS Vulnerability
**Vulnerability:** `marked` library (v17+) does not sanitize HTML output by default, leading to potential Stored XSS.
**Learning:** Even if `marked` documentation suggests extensions, direct usage without sanitization is insecure. `isomorphic-dompurify` is required for Nuxt/Vue SSR apps.
**Prevention:** Always use a sanitization wrapper (like `renderMarkdown` utility) when rendering user-generated markdown.
