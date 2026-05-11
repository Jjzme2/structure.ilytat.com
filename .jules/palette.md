## 2024-11-01 - Toast Component Accessibility
**Learning:** Toast notifications often go unnoticed by screen readers if they lack dynamic role and aria-live attributes based on the severity of the notification (e.g., alert vs status). Decorative icons in toasts also clutter screen reader output.
**Action:** Always assign role="alert" and aria-live="assertive" for error/warning toasts, and role="status" with aria-live="polite" for success/info toasts. Ensure icon-only close buttons have aria-label and focus-visible styles, and purely decorative text/icons have aria-hidden="true".
