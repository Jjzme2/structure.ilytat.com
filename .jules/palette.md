## 2026-04-02 - Visual Notification Badges Accessibility
**Learning:** Visual notification badges (e.g., unread dots) should not be read aloud as separate, disconnected numbers by screen readers, which can cause confusion.
**Action:** Always add `aria-hidden="true"` to visual badge elements, and incorporate the state or count into the parent interactive element's dynamic `aria-label` (e.g., `aria-label="Inbox, 3 unread messages"`).
