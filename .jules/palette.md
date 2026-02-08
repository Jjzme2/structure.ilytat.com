## 2026-02-08 - Testing VueFire Components
**Learning:** To visually verify components relying on VueFire (like `useCurrentUser`) without valid credentials, set `ssr: false` in `nuxt.config.ts` and provide dummy Firebase keys in `.env`. This allows the client-side app to initialize and render UI states even if auth/network fails.
**Action:** Use this setup for isolated component verification when valid credentials are unavailable.
