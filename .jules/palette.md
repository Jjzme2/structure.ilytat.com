
## 2024-04-04 - Screen Reader Accessible Notification Badges
**Learning:** Visual notification badges (e.g., unread dots) on icon buttons should be hidden from screen readers (aria-hidden='true'). The state/count should instead be incorporated into the button's dynamic aria-label (e.g., 'Inbox, 3 unread messages').
**Action:** Always hide visual badge elements with `aria-hidden` and use dynamic `aria-label`s on the parent button for screen reader announcements.
