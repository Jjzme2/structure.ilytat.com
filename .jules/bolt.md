## 2025-05-27 - Unit Testing Nuxt Composables with useState
**Learning:** Testing Nuxt composables that use `useState` in Vitest requires `mockNuxtImport` from `@nuxt/test-utils/runtime` or careful global stubbing. Standard `vi.stubGlobal('useState', ...)` may be ignored if the composable relies on Nuxt auto-imports which are transpiled to import from `#imports`.
**Action:** Use `mockNuxtImport` to mock `useState` in tests, or ensure the test environment is fully Nuxt-aware.

## 2025-05-27 - Caching Lists in Composables
**Learning:** When implementing caching in composables using `useState`, ensure empty lists are also cached by checking a separate flag (e.g. `fetchedUserId` or `isLoaded`) rather than `data.length > 0`. Otherwise, empty states trigger redundant fetches.
**Action:** Use an explicit "fetched" tracker (boolean or ID) alongside the data.
## 2024-05-22 - Firestore Query Specificity
**Learning:** Fetching broad collections (e.g., all user tasks) and filtering in memory is a major performance anti-pattern in Firestore, leading to excessive read operations and potential bandwidth issues.
**Action:** Always construct specific queries using `where` clauses to fetch only the data needed for the current view. Ensure variable scopes are clean to avoid accidental redeclarations that might mask logic errors.

## 2025-05-27 - Firestore Bulk Updates Specificity
**Learning:** Using `Promise.all` alongside individual `updateDoc` calls on multiple documents triggers excessive network requests (O(n)), significantly degrading application performance and hitting bandwidth limits. This is a severe anti-pattern in Firebase Firestore.
**Action:** When performing bulk updates (like marking all inbox messages read), always use Firestore's `writeBatch` to group updates into a single network request. Be mindful of the hard limit of 500 operations per batch, grouping items appropriately.
