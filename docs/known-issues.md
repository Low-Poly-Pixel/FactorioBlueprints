# Known issues

Bugs that are known about but deliberately not fixed yet, tracked here until they're worth opening as GitHub issues or picking up.

## ~~Uncaught TypeError during query-stream hydration on every client-side navigation~~ (fixed)

Was silently aborting every `document.startViewTransition()` — including the "Back to search" flow — because `@tanstack/react-router-with-query`'s stream reader called react-query's `hydrate()` on its final `{done: true, value: undefined}` chunk without checking `done` first, throwing `TypeError: Cannot read properties of undefined (reading 'mutations')` on every page load.

Fixed by dropping `routerWithQueryClient` entirely: per [ADR-0009](adr/0009-loaders-vs-query-split.md) every loader here is awaited before commit (nothing streamed/deferred), so its progressive query-streaming was solving a problem this app doesn't have. `src/router.tsx` now sets `router.options.dehydrate`/`hydrate` itself, doing only the one-shot critical dehydrate/hydrate of the query cache that this app actually needs.
