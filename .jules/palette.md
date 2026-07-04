## 2024-07-04 - Fix double tooltip and WCAG 2.5.3 violation in TenantSwitcher
**Learning:** Replacing a native `title` attribute with an `aria-label` on an element containing visible text MUST include the visible text to satisfy WCAG 2.5.3 (Label in Name). Adding `aria-hidden="true"` to visual custom tooltips prevents redundant screen reader announcements.
**Action:** Always include visible button text within its `aria-label` if overriding, and avoid using native `title` attributes when custom CSS tooltips exist.
