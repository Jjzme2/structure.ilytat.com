## 2024-04-28 - Dynamic ARIA labels for icon badges
**Learning:** Visual notification badges on icon buttons (like unread counts on a bell icon) often cause screen readers to read the badge text disconnected from context, or result in redundant "Inbox, 3... 3" announcements if both the button and the badge have readable text.
**Action:** When an icon button has a badge, dynamically calculate the `aria-label` on the parent button to include the full state (e.g., "Inbox, 3 unread messages"), and explicitly hide both the SVG icon and the badge span using `aria-hidden="true"`.
