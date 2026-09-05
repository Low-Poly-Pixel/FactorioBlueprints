# FactorioBlueprints

A website that stores and browses Factorio blueprint export strings, with parsed previews (item icons, nested contents) rather than treating the string as an opaque blob.

## Language

**Blueprint**:
A single entity's saved design (e.g. one factory layout), decoded from a Factorio export string. One of the four entity kinds a stored export string can hold.
_Avoid_: Design, layout (when referring to the stored entity specifically)

**Blueprint Book**:
A named collection of Blueprints, Upgrade Planners, Deconstruction Planners, and/or other Blueprint Books, nested arbitrarily deep. One of the four entity kinds.

**Upgrade Planner**:
An entity kind that specifies entity-to-entity upgrade rules (e.g. "replace this belt tier with that one"). Canonical name matches Factorio's own in-game item and export JSON key (`upgrade_planner`).
_Avoid_: Construction planner

**Deconstruction Planner**:
An entity kind that specifies deconstruction filters/rules. Canonical name matches Factorio's own in-game item and export JSON key (`deconstruction_planner`).
_Avoid_: Destruction planner

**Game Version**:
The Factorio version (major, minor, patch, dev) a Blueprint/Blueprint Book/Upgrade Planner/Deconstruction Planner was created with, decoded from the `version` field embedded in every export string. Stored as its four component parts, not a single display string, so entries can be filtered by version.

**Space Age flag**:
A per-item marker on entries in the icon/item static config indicating the item belongs to the Space Age expansion rather than the base game. Purely informational — surfaced as a badge/tag so a viewer without the expansion can tell a Blueprint uses something they don't have.
