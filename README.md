# FactorioBlueprints

A website that stores and browses Factorio blueprint export strings, with parsed previews rather than treating the string as an opaque blob. See [CONTEXT.md](CONTEXT.md) for domain language and [docs/adr](docs/adr) for architecture decisions.

## Stack

React via TanStack Start on Vite, deployed to Cloudflare Workers, D1 as the only datastore. See [ADR-0003](docs/adr/0003-tanstack-start-cloudflare-stack.md).

## Development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — local dev server
- `npm run build` / `npm run preview` — production build / preview it locally
- `npm run deploy` — build and deploy to Cloudflare Workers
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` / `npm run lint:fix` — Biome check
- `npm run cf-typegen` — regenerate `worker-configuration.d.ts` from `wrangler.jsonc` (run after changing bindings)
- `npm run generate-routes` — regenerate `src/routeTree.gen.ts` (runs automatically on dev/build)

## Coding style

See [CLAUDE.md](CLAUDE.md).
