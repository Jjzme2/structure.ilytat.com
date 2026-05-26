## 2024-05-26 - Dynamic Toast Accessibility Attributes
**Learning:** Toasts are complex for screen readers because their urgency dictates their aria roles. Hardcoding `role="alert"` causes screen readers to aggressively interrupt the user for minor success notifications, while `role="status"` may hide critical errors.
**Action:** When implementing toast notifications, always map the `role` and `aria-live` attributes dynamically to the notification's severity (e.g., alert/assertive for errors, status/polite for success).
