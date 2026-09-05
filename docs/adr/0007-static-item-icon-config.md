# Item/icon mapping is a static config file, not a D1 table

The item-to-icon mapping (including each item's Space Age flag, see `CONTEXT.md`) lives in a static config file checked into the repo, not a D1 table.

We decided this because Wube has stated Factorio is content-complete and will not add further game content, so there's no live-updating multi-version mapping to serve — a file that ships with the app is simpler than a table that would need migrations/admin tooling for data that never changes.
