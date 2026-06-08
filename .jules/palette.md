## 2024-06-08 - Accessible Toast Notifications
**Learning:** Toast components need dynamic ARIA roles (`alert` vs `status`) and live regions (`assertive` vs `polite`) depending on the severity of the message. Decorative icons must be hidden from screen readers, and icon-only close buttons require clear ARIA labels and visible focus states.
**Action:** Always apply `role` and `aria-live` attributes dynamically based on notification type, add `aria-hidden="true"` to structural/decorative icons, and ensure all icon-only buttons have `aria-label` and `focus-visible` styling.
