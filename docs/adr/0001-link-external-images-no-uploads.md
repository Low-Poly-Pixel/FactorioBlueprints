# Link to external image sources instead of storing uploaded images

Blueprint/item icons are linked directly from Factorio's official CDN, with the wiki as a manual fallback for icons missing from the CDN. We do not accept user-uploaded images (e.g. custom thumbnails or screenshots) and do not use R2 or any other blob storage for images.

We decided this to avoid the operational cost of user-uploaded content: storage limits, moderation, and spam. The trade-off is reduced control over imagery (dependent on two external hosts staying available) and no support for custom blueprint screenshots, in exchange for a much simpler, cheaper system with no moderation surface.
