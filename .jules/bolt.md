# Bolt's Journal ⚡

## 2026-02-08 - Optimized Task Filtering in Vue
**Learning:** In Vue, having multiple `computed` properties that each `.filter()` the same large source array (e.g., specific columns in a Kanban board) creates an `O(N * M)` bottleneck, where N is items and M is columns.
**Action:** Use a single `computed` property to grouping the data into a Record/Map in one pass `O(N)`, then let downstream consumers access their specific slice. This reduces iteration overhead significantly.
