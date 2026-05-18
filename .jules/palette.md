## 2024-05-18 - Toast Notification Accessibility
**Learning:** Toast components require dynamic aria-live ('assertive' for errors, 'polite' for status) and appropriate roles to prevent screen readers from missing critical alerts or over-announcing routine updates.
**Action:** Always map notification severity to both visual indicators and ARIA live region attributes in global notification containers.
