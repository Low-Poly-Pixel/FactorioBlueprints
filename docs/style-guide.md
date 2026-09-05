# Style Guide

Current visual conventions for FactorioBlueprints. This tracks what *is*, not why — see `docs/adr/` for the rationale and history behind a given decision.

Visual/UI direction beyond what's listed here is still unsettled (see [ADR-0005](adr/0005-shadcn-dark-mode-only.md) for the foundation that is settled). Add to this file as more decisions land; don't fabricate entries ahead of an actual decision.

## Shape

- **Corners: slight rounding.** `--radius: 4px` in `src/styles.css`. Applies everywhere via shadcn's derived radius tokens — don't override `rounded-*` per component. See [ADR-0010](adr/0010-sharp-corners.md).
- **No borders except the header's divider.** Panels/cards/icon slots are `bg-card` against the page's `--background`, no outline — that lightness contrast alone is enough to read as a distinct surface. The header keeps its `shadow-[0_1px_0_0_var(--border)]` bottom divider. The Blueprint Book tree's nesting guide line (`border-l`) is exempt — it's a structural indicator, not container chrome. See [ADR-0013](adr/0013-no-borders-except-header.md).

## Color

- Dark mode only, shadcn's default neutral palette (`src/styles.css` `:root` tokens), plus one accent.
- **Accent: Factorio orange**, `--primary: oklch(0.787 0.172 69.121)` (`#ffa200` sourced from factorio.com's own `.orange` CSS class). Drives the default Button variant and other primary surfaces. Keep `--primary-foreground` dark — it's contrast-checked against this orange, white text is not. See [ADR-0011](adr/0011-factorio-orange-accent.md).
- **Entity-kind semantic colors**: `--info` (blue, `oklch(0.714 0.143 254.624)`) for Blueprint/Blueprint Book, `--success` (green, `oklch(0.8 0.182 151.711)`) for Upgrade Planner, and the existing `--destructive` (red) for Deconstruction Planner — used via `text-info`/`text-success`/`text-destructive` in `BlueprintResultCard.tsx`. All three checked at ≥4.5:1 against the page background (`#0a0a0a` from `--background`) for WCAG AA per [ADR-0002](adr/0002-wcag-aa-hard-requirement.md): info 7.79:1, success 11.36:1, destructive 6.85:1. These are generic semantic tokens (info/success/destructive), not entity-specific ones — reuse them for other info/success/danger UI before adding new color tokens.

## Interaction

- **Search result card hover**: the card's own `bg-card` shifts to a dull accent tint — `color-mix(in oklch, var(--card), var(--primary) 15%)` — rather than swapping to a transparent/orange background outright, so the card's base surface color stays present underneath the tint. Combined with a subtle `-translate-y-0.5` lift and neutral drop shadow — see `BlueprintResultCard.tsx`. Replaced two earlier attempts: a plain `border-primary` outline (dropped once borders were removed app-wide, see [ADR-0013](adr/0013-no-borders-except-header.md)), then a left-edge accent bar (dropped as not quite right either).
- **Superseded parked idea**: an animated version where the orange grows from two points around the border until they meet, instead of the border snapping to orange outright (masked `conic-gradient` pseudo-element, `@property`-animated angle). Prototyped and worked, but reverted as more than currently wanted — and moot now that the hover treatment isn't border-based at all. Revisit only if a future border-based hover state comes back.

## Typography

- **Body font: Titillium Web**, sourced from factorio.com's own stylesheet, loaded via Google Fonts and set as Tailwind's `--font-sans` token in `src/styles.css`. See [ADR-0012](adr/0012-titillium-web-font.md).
- Titillium Web renders smaller and lighter than a typical sans fallback at the same declared size/weight. Compensated in two places: root `font-size: 106.25%` in `styles.css` (scales the whole rem-based Tailwind scale proportionally), and `Button` bumped from `font-medium` to `font-semibold` (`ui/button.tsx`). Reapply this same logic if other text ends up looking too light at its stated weight.

## Spacing

- **Stacked text within a list item/card**: one `flex flex-col gap-1` wrapper around all the stacked lines, not an independent `mt-1`-style margin per line. Sourced from inspecting Vercel's own template-gallery card markup (`flex flex-col gap-1` wrapping their title + description) — see `BlueprintResultCard.tsx`. Use `gap-2` for a row of inline-grouped items (e.g. entity kind + version sitting side by side) within that same stack.
