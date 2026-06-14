## 2024-06-14 - Accessible Toasts
**Learning:** Toast and notification components must dynamically adapt ARIA roles (`alert` vs `status`) and live regions (`assertive` vs `polite`) based on severity to prevent screen readers from interrupting users inappropriately.
**Action:** Always map error/warning toasts to `role="alert"` and `aria-live="assertive"`, while success/info toasts use `role="status"` and `aria-live="polite"`. Ensure close buttons have visible focus rings and decorative icons are hidden.
