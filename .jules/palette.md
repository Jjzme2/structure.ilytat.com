## 2024-05-24 - Dynamic ARIA Roles for Toasts based on Severity
**Learning:** Screen readers often miss generic toast notifications unless they have appropriate ARIA live regions. Using `role="alert"` and `aria-live="assertive"` for error toasts ensures immediate feedback, while `role="status"` and `aria-live="polite"` handles success/info messages without interrupting the user mid-task.
**Action:** Always dynamically bind `role` and `aria-live` attributes based on the severity/type of the notification when building custom toast or alert components.
