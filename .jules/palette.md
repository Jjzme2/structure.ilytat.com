
## 2026-05-19 - Toast Notification Accessibility
**Learning:** Toast components must dynamically change their 'role' ('alert' vs 'status') and 'aria-live' ('assertive' vs 'polite') based on severity so screen readers properly announce errors immediately without interrupting for routine success messages. Additionally, text icons need aria-hidden and bare icon buttons need aria-labels and focus styles to be usable.
**Action:** Always map toast severity (error/warning vs success/info) to the appropriate ARIA live region attributes when building notification systems.
