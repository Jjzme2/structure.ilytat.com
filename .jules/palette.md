## 2024-05-12 - Dynamic ARIA for Notifications
**Learning:** Toast or notification components must dynamically use role='alert' and aria-live='assertive' for error/warning types, and role='status' with aria-live='polite' for general/success updates. Purely decorative icons must use aria-hidden='true', and icon-only buttons need an aria-label and visible focus states.
**Action:** Always dynamically bind role and aria-live attributes based on the severity of the notification in custom toast components, and ensure all icon buttons have an aria-label.
