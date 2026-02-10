## 2026-02-07 - Testing Nuxt Server Handlers
**Vulnerability:** Difficulty in testing server handlers due to auto-imports.
**Learning:** Nuxt server handlers rely on auto-imports (`defineEventHandler`, `readMultipartFormData`, `createError`) which are not present in standard Vitest unit tests.
**Prevention:** Always mock these globals or use `@nuxt/test-utils` environment when writing unit tests for server API handlers.

## 2026-02-07 - Safe Markdown Rendering
**Vulnerability:** Stored XSS via Markdown content rendered with `v-html` using `marked`.
**Learning:** The `marked` library does not sanitize output by default, leading to XSS if user input is rendered directly.
**Prevention:** Use the reusable `renderSafeMarkdown` utility (which combines `marked` with `isomorphic-dompurify`) for all markdown rendering to enforce sanitization.
