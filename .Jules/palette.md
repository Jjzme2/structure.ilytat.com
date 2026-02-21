## 2025-02-26 - Hidden Action Buttons Accessibility
**Learning:** Action buttons that are revealed only on hover using `opacity-0 group-hover:opacity-100` (common in card lists like notes/tasks) are invisible to keyboard users even when they receive focus.
**Action:** Always add `focus-within:opacity-100` to the container so that tabbing into the action buttons reveals them.
