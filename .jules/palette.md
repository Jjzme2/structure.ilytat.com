
## 2024-06-04 - Dynamic Toast Accessibility Roles
**Learning:** Toast components must dynamically adjust `role` and `aria-live` based on severity (`alert`/`assertive` for errors vs `status`/`polite` for success).
**Action:** Always map toast severity to specific ARIA live region attributes to ensure screen readers announce critical errors immediately while queuing minor updates gracefully.
