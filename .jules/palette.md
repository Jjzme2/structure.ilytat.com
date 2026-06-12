## 2024-05-24 - Custom Tooltips and ARIA attributes
**Learning:** When using custom visual tooltips on elements, relying on the native HTML `title` attribute causes redundant double tooltips. Custom toggle buttons also need `aria-pressed` to communicate active state to screen readers.
**Action:** Use `aria-label` instead of `title` when a custom tooltip is present. Always include `aria-pressed` on custom view switchers and ensure decorative elements inside interactive elements use `aria-hidden="true"`.
