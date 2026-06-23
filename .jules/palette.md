## 2024-05-24 - Tenant Switcher Tooltip
**Learning:** Avoid using the native HTML `title` attribute on elements that already have a custom visual tooltip, as it causes redundant double tooltips. Use `aria-label` instead to ensure screen reader accessibility without interfering with the custom UI. Also include `aria-pressed` for toggle buttons.
**Action:** Always replace `title` with `aria-label` when building custom tooltips, and add `aria-hidden="true"` to the custom visual tooltip div.
