## 2026-06-28 - WCAG 2.5.3 Label in Name constraint on dynamic buttons
**Learning:** Overwriting visible text with an action-oriented `aria-label` directly violates WCAG 2.5.3 (Label in Name), breaking speech recognition tools. Furthermore, combining dynamic action labels with `aria-pressed` toggle states creates semantic confusion.
**Action:** When adding accessibility labels to elements with visible text, always ensure the visible text is included within the `aria-label`. Avoid using `aria-pressed` on buttons with dynamic action labels.
