## 2024-05-18 - Firebase Firestore Batch Writes for Multiple Updates
**Learning:** Updating multiple documents in Firestore concurrently using `Promise.all` creates multiple distinct network requests, which is inefficient. Using `writeBatch` consolidates them into a single request, improving performance and atomic consistency.
**Action:** When updating or writing to multiple Firestore documents in a loop (like marking multiple messages as read), always use `writeBatch` to bundle the operations into one network call.

## 2024-05-18 - Firebase Firestore Batch Writes for Multiple Updates
**Learning:** Updating multiple documents in Firestore concurrently using `Promise.all` creates multiple distinct network requests, which is inefficient. Using `writeBatch` consolidates them into a single request, improving performance and atomic consistency.
**Action:** When updating or writing to multiple Firestore documents in a loop (like marking multiple messages as read), always use `writeBatch` to bundle the operations into one network call.
