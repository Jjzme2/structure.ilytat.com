## 2025-05-27 - Dynamic ARIA Roles in Notification Components
**Learning:** Toast components in this app's design system lacked dynamic ARIA roles and labels, missing the nuance between critical alerts and polite statuses, making them inaccessible to screen readers.
**Action:** Always dynamically assign `role='alert'` and `aria-live='assertive'` for error/warning notifications, and `role='status'` with `aria-live='polite'` for general/success updates. Ensure icon-only buttons have an `aria-label` and visible focus states, and purely decorative icons use `aria-hidden='true'`.
