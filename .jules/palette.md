
## 2024-06-01 - Toast Component Accessibility
**Learning:** Toast and notification components must dynamically announce themselves to screen readers based on severity. Errors/warnings need `role='alert'` and `aria-live='assertive'` to interrupt, while success/info updates need `role='status'` and `aria-live='polite'` to avoid disruptive announcements. Icon-only buttons must also have visible focus states and `aria-label`.
**Action:** Always map toast severity types to appropriate ARIA live region attributes dynamically, and ensure purely decorative icons inside components are explicitly hidden with `aria-hidden="true"`.
