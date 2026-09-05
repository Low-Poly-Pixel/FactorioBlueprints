-- Migration number: 0001 	 2026-09-05T14:04:34.108Z

CREATE TABLE blueprints (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  entity_kind TEXT NOT NULL CHECK (entity_kind IN ('blueprint', 'blueprint_book', 'upgrade_planner', 'deconstruction_planner')),
  game_version_major INTEGER NOT NULL,
  game_version_minor INTEGER NOT NULL,
  game_version_patch INTEGER NOT NULL,
  game_version_dev INTEGER NOT NULL,
  export_string TEXT NOT NULL
);
