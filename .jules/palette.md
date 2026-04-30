## 2024-04-30 - Toast Notification Accessibility
**Learning:** Toast components must dynamically adjust screen reader announcements based on their severity. Errors and warnings need immediate attention (`role='alert'` / `aria-live='assertive'`), while success and info messages should not interrupt the user's current task (`role='status'` / `aria-live='polite'`).
**Action:** Always apply dynamic ARIA roles and live regions to notification components, and ensure interactive elements like close buttons have proper `aria-label`s and visible focus states.
