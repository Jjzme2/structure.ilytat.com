## 2024-05-24 - Broken ARIA References in Auth Forms
**Learning:** Auth forms (login, password reset) consistently use `aria-describedby` pointing to error message IDs that don't exist in the DOM (e.g., `login-error`), creating a broken accessibility experience.
**Action:** When working on forms in this codebase, explicitly verify that elements referenced by `aria-describedby` have the corresponding `id` attribute, and ensure the error container has `role="alert"`.
