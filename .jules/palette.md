## 2024-05-30 - Dynamic Toast Accessibility Roles
**Learning:** Toasts in this app's components dynamically handle varying severities (error vs info) but previously lacked dynamic ARIA roles, meaning screen readers missed the urgency of critical errors versus standard updates.
**Action:** Always implement dynamic `role='alert'` / `aria-live='assertive'` for error types and `role='status'` / `aria-live='polite'` for general info, and add visible focus states to their interactive elements.
