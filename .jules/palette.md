## 2024-05-21 - Toast Accessibility Roles
**Learning:** Dynamic toast components require changing ARIA attributes based on context: errors/warnings need role="alert" and aria-live="assertive", while general/success updates need role="status" and aria-live="polite" to avoid interrupting screen readers unnecessarily.
**Action:** Always dynamically bind ARIA roles based on notification severity in global toast containers.
