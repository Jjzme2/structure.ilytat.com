## 2025-05-27 - Unit Testing Nuxt Composables with useState
**Learning:** Testing Nuxt composables that use `useState` in Vitest requires `mockNuxtImport` from `@nuxt/test-utils/runtime` or careful global stubbing. Standard `vi.stubGlobal('useState', ...)` may be ignored if the composable relies on Nuxt auto-imports which are transpiled to import from `#imports`.
**Action:** Use `mockNuxtImport` to mock `useState` in tests, or ensure the test environment is fully Nuxt-aware.

## 2025-05-27 - Caching Lists in Composables
**Learning:** When implementing caching in composables using `useState`, ensure empty lists are also cached by checking a separate flag (e.g. `fetchedUserId` or `isLoaded`) rather than `data.length > 0`. Otherwise, empty states trigger redundant fetches.
**Action:** Use an explicit "fetched" tracker (boolean or ID) alongside the data.
## 2024-05-22 - Firestore Query Specificity
**Learning:** Fetching broad collections (e.g., all user tasks) and filtering in memory is a major performance anti-pattern in Firestore, leading to excessive read operations and potential bandwidth issues.
**Action:** Always construct specific queries using `where` clauses to fetch only the data needed for the current view. Ensure variable scopes are clean to avoid accidental redeclarations that might mask logic errors.

## 2024-05-27 - Vue Computed Property Array Optimizations
**Learning:** In Vue computed properties that process large arrays (like Firestore collections), chaining `.sort()` before `.filter()` can lead to massive unnecessary overhead. Sorting is generally O(N log N) while filtering is O(N). By filtering *first*, you drastically reduce the input size N for the sorting operation. This becomes critical as the user's data grows (e.g. hundreds of archived or completed tasks that don't need sorting).
**Action:** Always apply `.filter()` before `.sort()` when combining array operations in computed properties to ensure the O(N log N) operation processes the smallest possible dataset.
