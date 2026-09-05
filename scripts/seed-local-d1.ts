import { readdirSync, readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { nanoid } from 'nanoid';
import {
  decodeBlueprintString,
  decodeBlueprintTree,
} from '../src/shared/blueprint/exportStringDecoder.ts';
import {
  resolveIconUrl,
  resolveTreeIcons,
} from '../src/shared/blueprint/icons.ts';

const fixturesDir = new URL('../fixtures/blueprint-strings/', import.meta.url);
const sqliteFilePath = process.argv[2];

if (!sqliteFilePath) {
  throw new Error(
    'Usage: node scripts/seed-local-d1.ts <local-d1-sqlite-path>',
  );
}

const db = new DatabaseSync(sqliteFilePath);
db.exec('DELETE FROM blueprints');

const insert = db.prepare(
  'INSERT INTO blueprints (id, title, description, entity_kind, game_version_major, game_version_minor, game_version_patch, game_version_dev, export_string, icons, author, created_at, tree) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
);

const files = readdirSync(fixturesDir).filter((name) => name.endsWith('.txt'));

// Staggered fake upload ages (days) so the seeded data actually exercises
// every unit the "time since upload" formatter supports, instead of every
// fixture showing "0 days ago" forever in local dev. Real uploads get
// their genuine created_at from the upload server function, not this.
const fakeUploadAgeDays = [3, 14, 60, 500, 0];
const dayMs = 24 * 60 * 60 * 1000;

for (const [index, file] of files.entries()) {
  const raw = readFileSync(new URL(file, fixturesDir), 'utf8');
  const decoded = decodeBlueprintString(raw);
  const resolvedIcons = await Promise.all(
    decoded.icons.map((icon) => resolveIconUrl(icon)),
  );
  const resolvedTree = await resolveTreeIcons(decodeBlueprintTree(raw));
  const createdAt = Date.now() - (fakeUploadAgeDays[index] ?? 0) * dayMs;

  insert.run(
    nanoid(),
    decoded.title,
    decoded.description,
    decoded.entityKind,
    decoded.gameVersion.major,
    decoded.gameVersion.minor,
    decoded.gameVersion.patch,
    decoded.gameVersion.dev,
    decoded.exportString,
    JSON.stringify(resolvedIcons.filter((icon) => icon !== null)),
    null,
    createdAt,
    JSON.stringify(resolvedTree.children),
  );
}

db.close();
console.log(`Seeded ${files.length} blueprints into ${sqliteFilePath}`);
