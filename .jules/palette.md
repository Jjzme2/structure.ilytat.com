## 2026-02-12 - Accessible File Inputs
**Learning:** Custom file inputs often hide the `input` element with `display: none` (`hidden`), which removes it from the accessibility tree and prevents keyboard focus.
**Action:** Use `sr-only` class on the input and `peer-focus` classes on the label (with `peer` on the input) to ensure keyboard users can focus and upload files while maintaining visual design.
