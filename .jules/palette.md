## 2024-05-24 - Dynamic ARIA Roles for Notifications
**Learning:** Toast components must dynamically adjust `role` and `aria-live` attributes based on severity (e.g. error vs success). Hardcoding `role="alert"` for all notifications can unnecessarily interrupt screen reader users for trivial updates.
**Action:** Implemented a dynamic binding for `role` ('alert'/'status') and `aria-live` ('assertive'/'polite') based on the `toast.type` property.
