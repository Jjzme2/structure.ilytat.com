## 2025-06-03 - Toast Component Accessibility
**Learning:** Toast notifications must dynamically set `role="alert"` and `aria-live="assertive"` for errors/warnings, while using `role="status"` and `aria-live="polite"` for general updates. Decorative icons need `aria-hidden="true"`, and the dismiss button requires an `aria-label` with visible focus states.
**Action:** Always ensure custom notification components implement dynamic ARIA live regions based on severity and provide accessible icon-only controls.
