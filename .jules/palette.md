## 2024-06-13 - Dynamic ARIA for Toast Notifications
**Learning:** Toast or notification components must dynamically use `role='alert'` and `aria-live='assertive'` for error/warning types, and `role='status'` with `aria-live='polite'` for general/success updates. Purely decorative icons require `aria-hidden='true'`, and icon-only close buttons need `aria-label` and visible focus states.
**Action:** Always map toast types to their appropriate ARIA roles and live regions to ensure screen readers announce critical errors immediately without interrupting for minor status updates.
