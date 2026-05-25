## 2024-05-25 - Dynamic ARIA Roles in Toasts
**Learning:** Toast components must dynamically adjust `role` ('alert' vs 'status') and `aria-live` ('assertive' vs 'polite') based on notification severity so screen readers announce critical errors immediately without interrupting for minor updates.
**Action:** Always map notification types to appropriate ARIA roles and live regions, and ensure icon-only dismiss buttons have `aria-label` and visible focus states.
