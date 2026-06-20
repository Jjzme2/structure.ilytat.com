## 2024-10-24 - Toast Accessibility
**Learning:** Toast components were completely invisible to screen readers because they lacked `role="alert"`/`role="status"` and `aria-live` attributes. Icon-only close buttons also lacked `aria-label`s.
**Action:** Always dynamically assign `role='alert'`/`aria-live='assertive'` for error/warning notifications and `role='status'`/`aria-live='polite'` for general/success ones. Ensure all icon-only buttons have an `aria-label` and `focus-visible` styles.
