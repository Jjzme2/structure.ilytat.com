## 2024-05-23 - Accessibility First: Tenant Switcher
**Learning:** Toggle buttons that rely purely on visual cues (text/color) are inaccessible. Adding `aria-label` describing the *action* (e.g., "Switch to Personal Workspace") and ensuring focus visibility makes them usable for everyone.
**Action:** Always verify custom components have `aria-label` and `focus-visible` styles, especially for icon-only or ambiguous buttons.

## 2024-05-23 - Code Hygiene: accidental pastes
**Learning:** Found a critical bug where Firestore security rules were pasted directly into a TypeScript file (`useDaily.ts`), breaking the build.
**Action:** Always review file contents after pasting large blocks of code, and ensure security rules are in `firestore.rules`.
