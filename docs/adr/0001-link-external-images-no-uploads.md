# Link to external image sources instead of storing uploaded images

Blueprint/item icons are linked directly from the `deniszholob/icons-factorio` community icon set (served via jsDelivr's GitHub CDN passthrough — see `src/shared/blueprint/icons.ts`), with the Factorio Wiki's `/images/thumb/...` path as a fallback for icons missing from that set. We do not accept user-uploaded images (e.g. custom thumbnails or screenshots) and do not use R2 or any other blob storage for images.

(This ADR originally said "Factorio's official CDN" — checked in-session and `cdn.factorio.com` only serves the marketing site's own branding assets, not per-item game icons, so that language was corrected to name the actual source.)

We decided this to avoid the operational cost of user-uploaded content: storage limits, moderation, and spam. The trade-off is reduced control over imagery (dependent on two external hosts staying available) and no support for custom blueprint screenshots, in exchange for a much simpler, cheaper system with no moderation surface.
