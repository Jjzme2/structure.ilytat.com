
## 2024-05-27 - Accessible Toast Notifications
**Learning:** Toast notifications dynamically popping up require proper ARIA attributes to be announced by screen readers without user interaction.
**Action:** Always use `role="alert"` and `aria-live="assertive"` for error/warning types, and `role="status"` with `aria-live="polite"` for general/success updates. Ensure decorative icons use `aria-hidden="true"` and close buttons have visible focus states (`focus-visible:ring-2`) and `aria-label`.
