
## 2024-04-16 - Accessible Notification Badges
**Learning:** Visual notification badges (e.g., unread dots or counts) on icon buttons are often missed by screen readers or read incorrectly if left as separate visual elements.
**Action:** Always add `aria-hidden="true"` to visual badges/icons and explicitly bake the dynamic state or count into the parent button's `aria-label` (e.g., `:aria-label="count > 0 ? 'Inbox, ' + count + ' unread' : 'Inbox'"`).
