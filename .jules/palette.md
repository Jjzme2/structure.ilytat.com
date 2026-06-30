## 2025-02-18 - Prevent redundant screen reader announcements for visual tooltips
**Learning:** Replacing a native `title` attribute with `aria-label` correctly fixes double-tooltip issues but can result in double announcements by screen readers if a custom visual tooltip is also present in the DOM.
**Action:** Always add `aria-hidden="true"` to custom visual tooltip elements when the interactive trigger already possesses an explicit `aria-label` describing the action, ensuring a clean and single announcement for screen reader users.
