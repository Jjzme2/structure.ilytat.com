## 2024-05-18 - TenantSwitcher Accessibility Improvement
**Learning:** Using the native HTML title attribute on elements that already have a custom visual tooltip causes redundant double tooltips. Also, custom toggle buttons need aria-pressed to communicate state to screen readers.
**Action:** Always use aria-label instead of title when a custom visual tooltip exists, add aria-hidden="true" to the custom tooltip element to prevent redundant announcements, and use aria-pressed for view switchers.
