# Anonymous, immutable access model for MVP

MVP has no accounts, no edit, no delete, and no secret-token "manage" link for uploads — every Blueprint/Book/Planner is anonymous and permanent once uploaded. The only spam guard is Cloudflare's IP-based rate limiting on the upload endpoint.

We decided this to keep the MVP scope minimal and ship something real rather than gold-plate an auth/ownership model up front. Accounts, editing, and deletion are explicitly deferred to a later phase, not designed away — this is a scope cut, not a permanent architecture. The immutability side-benefit is that SSR content can be cached aggressively at Cloudflare's edge (see [ADR-0003](0003-tanstack-start-cloudflare-stack.md)), since nothing ever changes after upload.
