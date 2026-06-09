## 2024-06-09 - Avoid redundant tooltips

**Learning:** When creating elements with custom visual tooltips (like the Tenant Switcher), using the native HTML `title` attribute causes redundant double tooltips for users and creates potential confusion for screen readers. Furthermore, toggle buttons need an `aria-pressed` attribute to properly communicate their active state to screen readers.
**Action:** Replace native HTML `title` attributes with `aria-label` when custom tooltips are present, and always include `aria-pressed` for toggle switches.
