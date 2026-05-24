## 2026-05-24 - Dynamic ARIA attributes in Toast Components
**Learning:** Toast components with multiple severity levels (error, warning, success, info) require dynamic ARIA attributes. A static `role="status"` is insufficient for errors.
**Action:** Always dynamically bind `role="alert"` and `aria-live="assertive"` for error/warning types, and `role="status"` and `aria-live="polite"` for general updates. Apply `aria-hidden="true"` to purely decorative icons, and ensure close buttons have an explicit `aria-label` and visible focus states.
