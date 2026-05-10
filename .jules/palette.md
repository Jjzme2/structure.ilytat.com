## 2024-05-10 - Custom Tooltips & Toggle Buttons
**Learning:** Using the native HTML `title` attribute on elements that already have a custom visual tooltip causes redundant double tooltips. Additionally, toggle buttons (like view switchers) need `aria-pressed` to communicate their state to screen readers.
**Action:** Always replace `title` with `aria-label` when a custom tooltip is present. Ensure all toggle-style buttons use the `aria-pressed` attribute to indicate active state, and include `focus-visible` styles for keyboard navigation.
