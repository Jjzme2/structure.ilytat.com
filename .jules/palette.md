## 2024-05-24 - Dynamic ARIA for Toast Notifications
**Learning:** For toast components or notifications, accessibility requires varying ARIA attributes based on the type of notification. Specifically, `role="alert"` and `aria-live="assertive"` should be used for errors, while `role="status"` and `aria-live="polite"` should be used for general/success updates.
**Action:** When creating or modifying notification systems, always dynamically apply `role` and `aria-live` based on severity, and ensure decorative icons use `aria-hidden="true"`.
