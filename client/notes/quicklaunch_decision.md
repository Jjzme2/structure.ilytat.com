# Quicklaunch & Command Palette Decision

**Date:** 2026-02-06
**Author:** AI Assistant via User Request

## Context
We initially built a dedicated "Quicklaunch" menu component in the navbar. However, the user identified that this functionality overlaps significantly with the existing Command Palette (Ctrl+K).

## Decision
1.  **Enhance Command Palette**: We moved the "Quicklaunch" concept into the Command Palette by adding external links (e.g., Firebase, GitHub) that open in new tabs.
2.  **Retain Navbar Component (For Now)**: The navbar Quicklaunch component remains for visibility, but the "power user" flow is redirected to Ctrl+K.
3.  **External Links**: These are configured in `client/config/quicklaunch.ts` and dynamically registered in `client/plugins/commands.ts`.

## Future Considerations
- If the navbar Quicklaunch becomes redundant, it can be removed in favor of a "Press Ctrl+K" tooltip or icon.
