# React + TanStack Start on Cloudflare Workers + D1

The app is built with React via TanStack Start (on Vite), deployed to Cloudflare Workers, with D1 as the only datastore (metadata and raw blueprint strings both — no R2, per [ADR-0001](0001-link-external-images-no-uploads.md)).

We decided this over Next.js/Remix because TanStack Start ships its own request/fetch handler (`@tanstack/react-start/server-entry`, wired in via `@cloudflare/vite-plugin`) — confirmed via TanStack's own docs that no separate router/framework (e.g. Hono) is needed in front of it on Cloudflare Workers.
