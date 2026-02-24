## 2025-05-15 - Unique IDs for Accessible Inputs
**Learning:** Reusable form components (like file uploads) must generate unique IDs for `input` and `label` association. Using `useId()` (Vue 3.5+) is the standard way to do this without manual ID prop management.
**Action:** Always use `useId()` when building form components to ensure `label` association and `aria-describedby` work correctly across multiple instances.
