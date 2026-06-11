## 2024-06-11 - Dynamic ARIA for Toasts
**Learning:** Toast components need dynamic `role` and `aria-live` attributes based on the severity of the notification (e.g., `alert`/`assertive` for errors vs `status`/`polite` for success). Decorative icons within toasts also require `aria-hidden='true'` and icon-only close buttons require visible focus states and `aria-label`.
**Action:** Always implement dynamic `role`/`aria-live` based on toast type for notifications and ensure purely decorative icons use `aria-hidden='true'`.
