# No borders except the header's divider

Panels, cards, and icon slots no longer use a `border`/`border-border` outline to read as distinct surfaces — they rely on background-color contrast instead (`bg-card` against the page's `--background`, which are far enough apart in lightness — `0.205` vs `0.1` — to read as separate surfaces on their own) plus spacing and, now, [rounded corners](0010-sharp-corners.md). The one exception is the header, which keeps its bottom divider (`border-b border-border` in `Header.tsx`) — it's the one place a hard line separating two regions (chrome vs. content) is actually the clearest signal, rather than decoration repeated on every panel.

(This was originally implemented as `shadow-[0_1px_0_0_var(--border)]`, to draw the line without using an actual `border` utility. That shadow never rendered — the header also has `overflow-hidden`, which clips a non-inset box-shadow painted by that same element. The divider visible before this fix was pure `bg-card`/`bg-background` contrast; the shadow was dead CSS from the start. Switched to a real `border-b`, which isn't subject to the same clipping.)

We decided this per direct request, alongside the corner-radius change in ADR-0010 — the two were previously part of the same "flat, sharp-edged" visual language, and both were designed to soften together, one variable/component convention at a time rather than left half-changed.

The Blueprint Book tree's nesting guide line (`border-l` in `BlueprintTreeNode.tsx`) is *not* covered by this — it's a structural indicator of parent/child scope, not decorative container chrome, so it stays.

The detail page's "Back to search" button (`BlueprintDetailPage.tsx`) is a second, deliberate exception: an orange `variant="outline"` button, per direct request, as a one-off call-to-action treatment rather than container chrome. Don't generalize this to other buttons without another explicit decision — the default/ghost/etc. Button variants elsewhere are unaffected.
