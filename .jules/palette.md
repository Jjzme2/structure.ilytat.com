## 2024-03-31 - Notification Badge Accessibility
**Learning:** Screen readers announce visual notification badges (e.g., unread dots) confusingly or redundantly if they aren't explicitly hidden and incorporated into a dynamic aria-label on the parent button.
**Action:** When implementing icon buttons with unread badges, hide the icon and badge from screen readers using `aria-hidden="true"`, and set a dynamic `:aria-label` on the parent button (e.g., "Inbox, 3 unread messages").
