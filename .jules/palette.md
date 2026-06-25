## 2025-06-25 - Prevent Redundant Tooltip Announcements
**Learning:** Avoid using the native HTML `title` attribute on elements that already have a custom visual tooltip, as it causes redundant double tooltips. Use `aria-label` instead to ensure screen reader accessibility, and add `aria-hidden="true"` to the custom visual tooltip element to prevent redundant announcements.
**Action:** When implementing custom tooltips, replace native `title` attributes with `aria-label` and mark the custom tooltip element with `aria-hidden="true"`.
