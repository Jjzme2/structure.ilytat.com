## 2024-05-04 - Accessible Toast Notifications
**Learning:** Toast notifications require dynamic `role` and `aria-live` attributes to ensure screen readers announce errors immediately (`alert`/`assertive`) while reading general updates politely (`status`/`polite`).
**Action:** Always implement dynamic roles, `aria-hidden` on decorative icons, and proper `aria-label` with focus states on close buttons for notification components.
