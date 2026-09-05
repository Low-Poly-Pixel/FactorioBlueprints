# Corner radius: single shared token, not sharp anymore

Every component's corner rounding is driven by one variable — `--radius` in `src/styles.css` — which feeds shadcn's derived `--radius-sm/md/lg/xl` tokens that individual components reference via `rounded-*` Tailwind classes. Originally set to `0px` (sharp/square corners, a deliberate deviation from shadcn's default). Revised to `4px` — a slight, subtle rounding — per direct request; still deliberate, still a single shared value, just no longer zero.

Single source of truth: change `--radius` in `styles.css` to adjust every component at once, rather than overriding `rounded-*` classes per component. See [the style guide](../style-guide.md) for the current value and other visual conventions.
