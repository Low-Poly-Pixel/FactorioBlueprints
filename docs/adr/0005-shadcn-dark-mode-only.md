# shadcn/ui component foundation, dark mode only

UI components are built on shadcn/ui (Radix UI primitives + Tailwind, generated into the repo via its CLI rather than installed as an opaque dependency). The site ships dark mode only for V1 — no light-mode toggle.

We decided shadcn/ui specifically to avoid the "looks like a generic MUI/Bootstrap template" feeling (a direct risk given [the portfolio motivation](../../CONTEXT.md)) while still getting WCAG-AA-correct behavior — focus management, keyboard navigation, ARIA — for free rather than hand-rolling it, which [ADR-0002](0002-wcag-aa-hard-requirement.md) makes a hard requirement anyway. Dark-mode-only was confirmed twice (the user second-guessed deferring it, then kept it in V1 scope) rather than building a second theme nobody asked for.
