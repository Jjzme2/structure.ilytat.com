## 2024-06-22 - Avoid native title attributes with custom tooltips
**Learning:** Native HTML `title` attributes on elements that already have a custom visual tooltip cause redundant double tooltips. Also, toggle buttons require `aria-pressed` to correctly communicate their active state to screen readers.
**Action:** Use `aria-label` instead of `title` for screen reader accessibility without interfering with the custom UI, and add `aria-pressed` for switchers.
