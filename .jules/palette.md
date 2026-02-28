## 2025-02-28 - Missing `aria-label`s on icon-only buttons
**Learning:** Found multiple instances where interactive elements containing only icons or visual symbols (e.g., `<button>✕</button>`) lack accessible names, rendering them unusable for screen reader users.
**Action:** When working on UI components, ensure any button without descriptive text content has an `aria-label` explicitly defining its action (e.g., `aria-label="Close inbox"`). Review other components for similar patterns.
