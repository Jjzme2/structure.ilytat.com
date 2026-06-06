## 2024-06-06 - Custom Tooltips and Toggle Buttons
**Learning:** Using native `title` attributes on elements with custom visual tooltips creates an annoying double-tooltip effect. Also, custom toggle buttons need `aria-pressed` to announce their state properly.
**Action:** Always replace `title` with `aria-label` when a custom tooltip is present, and add `aria-pressed` for toggle states.
