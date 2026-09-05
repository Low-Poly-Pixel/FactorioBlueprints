-- Migration number: 0003 	 2026-09-05T16:13:30.828Z

ALTER TABLE blueprints ADD COLUMN description TEXT;
ALTER TABLE blueprints ADD COLUMN author TEXT;
ALTER TABLE blueprints ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0;
