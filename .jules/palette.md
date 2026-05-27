
## 2024-05-27 - Dynamic Toast Accessibility Roles
**Learning:** Found a pattern where custom notification components lack dynamic ARIA roles. While success/info messages should be `role="status"` (`aria-live="polite"`), error/warning messages require `role="alert"` (`aria-live="assertive"`) so screen readers announce them appropriately. Decorative icons also lacked `aria-hidden="true"`.
**Action:** When auditing or building custom notification/toast systems, always ensure role and aria-live attributes dynamically adapt to the severity of the notification type, and icon-only buttons include `aria-label` with visible focus states.
