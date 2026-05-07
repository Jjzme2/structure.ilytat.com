## 2024-05-07 - Dynamic ARIA Attributes for Toasts
**Learning:** Toast components require dynamic accessibility attributes to ensure critical errors are announced immediately while success messages are read politely without interrupting the user.
**Action:** Always use role='alert' and aria-live='assertive' for error/warning types, and role='status' with aria-live='polite' for general/success updates.
