## 2024-05-31 - Redundant Tooltips and Toggle Button Accessibility
**Learning:** Using the native HTML title attribute on elements with custom visual tooltips causes redundant double tooltips for users. Custom toggle buttons also often lack state announcements for screen readers.
**Action:** Always use aria-label instead of title when custom tooltips exist, and implement aria-pressed on custom view switchers to accurately communicate their active state.
