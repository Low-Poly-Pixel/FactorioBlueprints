# Factorio-orange accent color

The site's accent color (`--primary` in `src/styles.css`, used by the default Button variant and other primary surfaces) is Factorio's own orange, sourced directly from `factorio.com`'s stylesheet rather than guessed or picked from a generic swatch: their CSS defines a `.orange` utility class as `#ffa200`, converted here to `oklch(0.787 0.172 69.121)` to match the OKLCH format the rest of this file's tokens use.

`--primary-foreground` stays the existing near-black token — contrast-checked at ~10.4:1 against this orange, comfortably clearing WCAG AA's 4.5:1 for normal text ([ADR-0002](0002-wcag-aa-hard-requirement.md)). Don't swap it for white text on this accent; white-on-orange measures ~2:1 and fails AA outright.
