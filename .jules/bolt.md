## 2026-02-10 - [Scroll Event Optimization]
**Learning:** Scroll events fire rapidly and accessing `window.scrollY` forces layout. Throttling with `requestAnimationFrame` and using `passive: true` significantly reduces main thread work.
**Action:** Extract scroll logic into a dedicated composable (e.g., `useScrollState`) and test it by mocking time and component lifecycle.
