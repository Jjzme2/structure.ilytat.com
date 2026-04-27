## 2024-05-18 - Visual Notification Badges Accessibility
**Learning:** Visual notification dots on icon buttons are often read poorly by screen readers or cause redundant noise if not properly hidden.
**Action:** Hide visual badges using `aria-hidden="true"` and incorporate the state dynamically into the parent button's `aria-label` (e.g. "Inbox, 3 unread messages").
