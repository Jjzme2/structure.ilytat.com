## 2024-05-22 - Dynamic ARIA Roles for Toasts
**Learning:** Toast notifications dynamically require different ARIA attributes depending on their urgency (e.g., `role="alert"` and `aria-live="assertive"` for errors, `role="status"` and `aria-live="polite"` for general success messages).
**Action:** Always implement conditional ARIA roles and live regions for dynamic notification components, and hide decorative icons with `aria-hidden="true"` while providing explicit `aria-label` attributes and focus styles for icon-only dismiss buttons.
