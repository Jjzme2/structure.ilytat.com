## 2025-02-20 - Redundant Native Tooltips with Custom UI
**Learning:** The TenantSwitcher component used both a custom visual tooltip and a native HTML `title` attribute, causing a confusing double-tooltip experience for users while hovering.
**Action:** When implementing custom hover tooltips, replace native `title` attributes with `aria-label` to maintain full screen reader accessibility without introducing visual redundancy.
