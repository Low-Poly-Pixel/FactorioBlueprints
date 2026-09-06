# FactorioBlueprints — Coding Style

Narrative rationale lives here. Every rule below that can be lint-enforced is backed by actual Biome config, not just this document — see [ADR-0008](docs/adr/0008-biome-tooling.md).

## Stack

React via TanStack Start on Vite, deployed to Cloudflare Workers, D1 as the only datastore. See [ADR-0003](docs/adr/0003-tanstack-start-cloudflare-stack.md).

## TypeScript

- `strict: true`, no exceptions.
- Use `type` for everything in application code — props, state shapes, function signatures. Use `interface` only when you must merge into a declaration you don't own: TanStack Router's `Register` (required to wire up a typed router), and possibly Cloudflare's generated `Env` binding type (`wrangler types`). If you're not merging into someone else's type, it's `type`.
- No `React.FC`. Type props directly on the function signature: `const Foo = ({ bar }: FooProps) => (...)`. Generic components use the `<T,>` trailing-comma form in `.tsx` files (plain `<T>` is ambiguous with JSX).
- Avoid type assertions (`as X`). An assertion tells the compiler to trust you with no runtime check behind it — if you're ever wrong, it fails silently instead of erroring where the bad data actually entered. If one is genuinely unavoidable, a comment must explain why (not just what). Not Biome-enforced — `noExplicitAny` catches `any` but not `as SomeSpecificType`, so this one is on us to hold ourselves to.
- In a ternary, lead with the substantive/computed branch; put a trivial fallback (`undefined`, `null`, `[]`, `''`, an early-exit default) last: `isReady ? computeResult() : fallback`, not `!isReady ? fallback : computeResult()`. The first form reads in the order a reader actually reasons through the problem ("if we can compute it, here's how — otherwise, here's the default"); leading with a negated guard whose branch is the trivial value forces re-reading the condition before the trivial branch makes sense. Not Biome-enforced — this is a judgment call about which branch is substantive, not something a linter can safely automate.
- Prefer `foo?: T` over `foo: T | undefined` for object/type properties. This repo doesn't set `exactOptionalPropertyTypes`, so the two are practically interchangeable — `?:` wins on convention and on matching whatever its sibling properties already do. This doesn't extend to every `| undefined` in the codebase: a function type's own parameter (e.g. `onChange: (value: T | undefined) => void` — the callback is always invoked with one argument; it's that argument's *value* that can be absent, not the argument itself), a return type (there's no such thing as an optional return), or a positional parameter followed by a required one (TypeScript doesn't allow optional-then-required, so the earlier parameter has to stay `| undefined`) are all cases where `?:` either doesn't apply or would mean something different. Not Biome-enforced — hold ourselves to it manually.
- Validate data at the boundary where it enters the app — a user-uploaded blueprint string, or any future external API call — with a Zod schema, rather than trusting `any`/an assertion past that point. See `src/shared/blueprint/decode.ts` for the pattern: the raw decoded JSON is Zod-validated once, and entity-kind narrowing afterward uses `in` checks on the now-typed result, not a cast.

## Components

- Arrow functions only — no function declarations, no function expressions. Enforced via Biome's `useArrowFunction`.
- Implicit return whenever the body is a single expression. Enforced via Biome's `useConsistentArrowReturn` (`asNeeded`).
- Named exports only: `export const BlueprintCard = (...) => ...`. Exception: route files under `routes/`, which keep TanStack Router's own `createFileRoute` export shape.
- Props typed inline via a `type` alias, destructured in the signature — not a separate destructure statement in a block body.

## Code-smell enforcement (Biome)

- `complexity` and `suspicious` rule groups: `"all"`. These are what stop the implicit-return convention above from hiding complexity — no block body means no intermediate variables, so a ternary chain that isn't literally "nested" but is still unreadable gets caught by cognitive-complexity limits instead of slipping through.
- `a11y` rule group: `"all"`. WCAG AA is a hard requirement ([ADR-0002](docs/adr/0002-wcag-aa-hard-requirement.md)), and the nested blueprint-book tree view is named there as a specific risk area.
- `correctness` and `style`: Biome's default `"recommended"`.
- `nursery`: off — experimental, not stable enough to enforce.
- See [ADR-0008](docs/adr/0008-biome-tooling.md) for why Biome replaces ESLint + Prettier entirely.

## File structure

- `routes/` — TanStack Router route files only, kept thin: each one imports its actual component/logic from `features/` rather than containing it.
- `features/<name>/` — anything used by exactly one feature, colocated (component, hook, test together).
- `shared/` — anything used by two or more features, promoted the moment a second feature needs it. shadcn/ui's generated primitives live in `shared/components/shadcn/` (see that folder's own README) — kept out of `shared/components/` proper and out of `ui/`'s generic naming so it reads unmistakably as CLI-generated, not hand-authored.
- No tool-enforced import boundaries between features (a `dependency-cruiser` config exists in this repo's skill templates and was deliberately not wired up here) — this project is solo-developer and four features wide, which is too small for that machinery to earn its cost. Revisit if the team or codebase grows.

## State

- `useState`/`useReducer` + Context for local UI state: modal open/closed, tree-node expand/collapse. No external state library unless a genuine cross-cutting need shows up.
- Search and filter state (title search, entity/item type, game version, "requires Space Age") lives in TanStack Router's typed search params — never in component state or Context. See [ADR-0009](docs/adr/0009-loaders-vs-query-split.md).

## Data fetching

- TanStack Start loaders + `createServerFn` for all SSR-critical or one-shot data: the detail page, the upload flow.
- TanStack Query, loader-seeded, only on the browse/search/filter page — see [ADR-0009](docs/adr/0009-loaders-vs-query-split.md) for why it's scoped there and nowhere else.

## UI components

- shadcn/ui: Radix UI primitives + Tailwind, generated into the repo via its CLI (not an opaque installed dependency) — chosen for WCAG-correct behavior (focus management, keyboard nav, ARIA) out of the box. See [ADR-0005](docs/adr/0005-shadcn-dark-mode-only.md).
- Dark mode only for V1 — no light-mode toggle.
- Corners: slight rounding via one `--radius` CSS variable, applied everywhere through shadcn's derived `rounded-*` tokens — don't override per component. See [ADR-0010](docs/adr/0010-sharp-corners.md).
- No borders anywhere except the header's bottom divider — panels/cards read as distinct surfaces via `bg-card` background contrast, not outlines. See [ADR-0013](docs/adr/0013-no-borders-except-header.md).
- See [docs/style-guide.md](docs/style-guide.md) for the current visual conventions as they get settled.
