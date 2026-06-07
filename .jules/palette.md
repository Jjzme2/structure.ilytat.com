## 2025-02-02 - Tenant Switcher Double Tooltip and Accessibility
**Learning:** Using the native `title` attribute on elements that already have a custom visual tooltip causes redundant double tooltips. Also, toggle buttons acting as view switchers must dynamically communicate their state.
**Action:** Always replace `title` with `aria-label` when a custom tooltip exists to prevent double tooltips, and utilize `aria-pressed` for toggle buttons to effectively communicate the active state to screen readers.
