## 2024-05-20 - Prevent redundant screen reader announcements with ARIA Labels
**Learning:** Replacing a native `title` attribute with `aria-label` prevents double tooltips for sighted users. However, if the element encapsulates visual text, the new `aria-label` must explicitly include that text to comply with WCAG 2.5.3 (Label in Name).
**Action:** When overriding tooltips, always ensure `aria-label` includes the element's inner text, and hide custom visual tooltips from screen readers using `aria-hidden="true"`.
