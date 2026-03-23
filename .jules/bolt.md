## 2025-05-27 - Unit Testing Nuxt Composables with useState
**Learning:** Testing Nuxt composables that use `useState` in Vitest requires `mockNuxtImport` from `@nuxt/test-utils/runtime` or careful global stubbing. Standard `vi.stubGlobal('useState', ...)` may be ignored if the composable relies on Nuxt auto-imports which are transpiled to import from `#imports`.
**Action:** Use `mockNuxtImport` to mock `useState` in tests, or ensure the test environment is fully Nuxt-aware.

## 2025-05-27 - Caching Lists in Composables
**Learning:** When implementing caching in composables using `useState`, ensure empty lists are also cached by checking a separate flag (e.g. `fetchedUserId` or `isLoaded`) rather than `data.length > 0`. Otherwise, empty states trigger redundant fetches.
**Action:** Use an explicit "fetched" tracker (boolean or ID) alongside the data.

## 2024-05-22 - Firestore Query Specificity
**Learning:** Fetching broad collections (e.g., all user tasks) and filtering in memory is a major performance anti-pattern in Firestore, leading to excessive read operations and potential bandwidth issues.
**Action:** Always construct specific queries using `where` clauses to fetch only the data needed for the current view. Ensure variable scopes are clean to avoid accidental redeclarations that might mask logic errors.

## 2025-05-27 - Vue Template O(n) Optimizations
**Learning:** Using array `.filter()` inside iterative Vue template bindings creates an `O(N*K)` performance bottleneck and causes component thrashing due to returning new array references every render.
**Action:** Pre-compute task associations or complex filtered groups using a `computed` Map dictionary, resolving template accesses via `map.get()` to achieve an efficient `O(1)` lookup with stable references.

## 2025-05-27 - Firestore Composite Index Limitations
**Learning:** Combining an equality filter (e.g. `==`) with an array membership or inequality filter (e.g. `in`) on different fields requires a pre-existing composite index to be deployed to the Firestore project. Adding these compound queries dynamically will crash the application and require a manual index build.
**Action:** Avoid combining `==` and `in` filters on different properties unless a composite index for those exact fields is already confirmed to be deployed.
