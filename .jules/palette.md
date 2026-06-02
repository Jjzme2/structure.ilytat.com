
## 2024-06-02 - TenantSwitcher Accessibility Fix
**Learning:** Using the native HTML `title` attribute on elements with custom visual tooltips causes redundant double tooltips. Also, custom view switchers often lack `aria-pressed` attributes.
**Action:** Replace `:title` with `:aria-label` to ensure screen reader support without interfering with custom tooltips, and always add `:aria-pressed` to custom toggle buttons to correctly communicate active state to screen readers.
