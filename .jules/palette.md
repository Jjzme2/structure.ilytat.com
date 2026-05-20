## 2024-05-20 - Toast Accessibility Improvements
**Learning:** Toast or notification components must dynamically use `role='alert'` and `aria-live='assertive'` for error/warning types, and `role='status'` with `aria-live='polite'` for general/success updates. Decorative icons need `aria-hidden='true'` and icon-only buttons need an `aria-label` and visible focus states.
**Action:** When implementing notification components, always apply the correct dynamic roles and aria-live attributes based on severity, and ensure interactive elements have clear focus states and aria labels.
