## 2024-04-29 - Dynamic ARIA Live Regions for Toasts
**Learning:** Toast components must dynamically adjust their `role` and `aria-live` attributes based on the severity of the message. Errors/warnings need `role="alert"` and `aria-live="assertive"` to interrupt the user, while success/info messages should use `role="status"` and `aria-live="polite"` to avoid unnecessary interruption.
**Action:** Always ensure notification components implement dynamic ARIA attributes instead of a static `aria-live="polite"` or missing attributes to guarantee critical errors are announced immediately.
