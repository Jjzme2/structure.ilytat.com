## 2024-05-14 - Dynamic ARIA Roles for Notifications
**Learning:** Toast components must dynamically adjust their `role` and `aria-live` attributes based on severity (e.g., alert/assertive for errors, status/polite for success) to avoid unnecessarily interrupting screen reader users for non-critical updates.
**Action:** Always implement dynamic a11y roles in notification systems based on message urgency, and ensure decorative icons are hidden (`aria-hidden="true"`) while icon-only buttons have proper `aria-label`s and focus states.
