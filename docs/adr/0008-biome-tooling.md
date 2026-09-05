# Biome replaces ESLint + Prettier

All linting and formatting runs through Biome — one tool, one config (`biome.json`) — instead of the usual ESLint + Prettier pair. The `complexity`, `suspicious`, and `a11y` rule groups are set to `"all"` (not just Biome's default `"recommended"`); `correctness` and `style` stay at `"recommended"`; `nursery` (experimental rules) stays off.

We decided `a11y` at `"all"` specifically because [ADR-0002](0002-wcag-aa-hard-requirement.md) makes WCAG AA a non-negotiable bar, and the nested blueprint-book tree view is called out there by name as a specific risk area. `complexity`/`suspicious` at `"all"` back the project's arrow-function/implicit-return convention: with no block body to hold intermediate variables, those two groups (nested ternaries, cognitive complexity, banned patterns) are what stops a one-line expression from silently becoming unreadable.
