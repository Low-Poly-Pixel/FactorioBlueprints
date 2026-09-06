# Known issues

Bugs that are known about but deliberately not fixed yet, tracked here until they're worth opening as GitHub issues or picking up.

## Uncaught TypeError during query-stream hydration on every client-side navigation

Every client-side navigation throws an uncaught error in the console:

```
Error reading query stream: TypeError: Cannot read properties of undefined (reading 'mutations')
  at hydrate (node_modules/.vite/deps/modern-*.js)
  at handle (@tanstack/react-router-with-query.js)
```

**Root cause:** `@tanstack/query-core`'s `hydrate(client, dehydratedState, options)` accesses `dehydratedState.mutations?.forEach(...)`. The optional chaining only guards `.forEach` — if `dehydratedState` itself is `undefined`, accessing `.mutations` throws before the `?.` applies. Something in `@tanstack/react-router-with-query`'s stream handling is calling `hydrate()` with `undefined`.

**Suspected cause:** version skew between packages:
- `@tanstack/react-router`: `1.170.32` (pinned to `"latest"` in package.json)
- `@tanstack/react-router-with-query`: `1.130.17` (pinned `^1.130.17`, which is also the latest version currently published for that package)

A ~40-minor-version gap between the core router and its query-integration package. Likely the newer router's SSR query-streaming payload shape/timing no longer matches what the integration package expects.

**Impact:** Confirmed this also causes `document.startViewTransition()`'s `ready` promise to reject with `"Transition was aborted because of invalid state"` during the same navigation — so any view transition gets silently skipped (DOM updates instantly, no animation) rather than throwing a visible failure. Discovered while investigating why a shared-element card transition wasn't animating on the browse → detail → back flow.

**Possible fixes to evaluate:**
1. Pin `@tanstack/react-router` / `@tanstack/react-start` to a version closer to what `react-router-with-query@1.130.17` was built against, instead of `"latest"`.
2. Check whether `routerWithQueryClient`'s SSR query-streaming wrapper is actually load-bearing for this app — queries here are loader-awaited before commit (see [ADR-0009](adr/0009-loaders-vs-query-split.md)), not streamed/deferred, so the wrapper's cross-navigation streaming behavior may not be needed at all.
