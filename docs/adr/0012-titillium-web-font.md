# Titillium Web body font

The site's font is Titillium Web, sourced the same way as [ADR-0011](0011-factorio-orange-accent.md): checked `factorio.com`'s own stylesheet, which sets `html { font-family: 'Titillium Web', sans-serif }` site-wide. It's an open-source Google Font (SIL OFL), loaded from `fonts.googleapis.com` rather than hotlinking Factorio's own CDN copy.

Wired in as Tailwind's `--font-sans` theme token in `src/styles.css`, applied via the existing `font-sans` utility on `body` — not hardcoded per component.
