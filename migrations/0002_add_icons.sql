-- Migration number: 0002 	 2026-09-05T14:54:10.509Z

ALTER TABLE blueprints ADD COLUMN icons TEXT NOT NULL DEFAULT '[]';
