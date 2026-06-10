
## 2024-06-10 - Custom Tooltip Double Triggers
**Learning:** Using native HTML title attributes on elements with custom visual tooltips causes redundant screen reader announcements and double tooltips. Toggle buttons missing aria-pressed fail to communicate active state.
**Action:** Always use aria-label instead of title when a custom visual tooltip is present, and ensure toggle buttons use aria-pressed for accurate state communication.
