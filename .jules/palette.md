## 2024-05-13 - Dynamic ARIA Roles for Toasts
**Learning:** Toast notifications need dynamic ARIA roles and live regions based on their severity to ensure screen readers announce critical errors correctly (`role="alert"`, `aria-live="assertive"`) without interrupting users for minor updates (`role="status"`, `aria-live="polite"`).
**Action:** When creating notification components, always map the severity type to the appropriate ARIA role and live region attributes to prioritize screen reader announcements correctly.
