## 2024-05-18 - Toast Notification Accessibility
**Learning:** Toast or notification components must dynamically use `role='alert'` and `aria-live='assertive'` for error/warning types, and `role='status'` with `aria-live='polite'` for general/success updates. Purely decorative icons need `aria-hidden='true'` and icon-only close buttons require an `aria-label` and visible focus states.
**Action:** Always implement dynamic `role` and `aria-live` attributes based on notification severity in transient UI elements, and ensure all interactive elements and icons are accessible to screen readers.
