## 2025-05-15 - Disconnected Form Errors
**Learning:** Found a recurring pattern in auth forms where error messages are disconnected from inputs (placed below submit button, lacking `id` or `aria-describedby`). This makes errors invisible to screen reader users until they navigate past the button.
**Action:** When touching form components, always move errors to be inline/above the submit button, add `id` to the error container, and link inputs via `aria-describedby`.
