## 2024-04-24 - Dynamic ARIA Roles for Notifications
**Learning:** Toast components with varying urgency (success vs. error) require dynamic `role` (`status` vs `alert`) and `aria-live` (`polite` vs `assertive`) attributes to ensure screen readers announce them with appropriate urgency. Hardcoding a single role fails to provide proper context.
**Action:** Always conditionally bind `role` and `aria-live` based on notification severity in global notification components.
