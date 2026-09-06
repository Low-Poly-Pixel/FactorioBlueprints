import { env } from 'cloudflare:workers';
import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';

import type {
  EntityKind,
  GameVersion,
} from '../../shared/blueprint/exportStringDecoder';
import type { ResolvedBlueprintIcon } from '../../shared/blueprint/icons';

export type BlueprintSummary = {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  uploadedAt: number;
  entityKind: EntityKind;
  gameVersion: GameVersion;
  icons: ResolvedBlueprintIcon[];
};

// Mirrors D1's actual snake_case column names, not the repo's camelCase
// convention — the map() below is the one place that translates into
// BlueprintSummary, rather than pretending this boundary looks like that.
type BlueprintRow = {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  created_at: number;
  entity_kind: EntityKind;
  game_version_major: number;
  game_version_minor: number;
  game_version_patch: number;
  game_version_dev: number;
  icons: string;
};

const selectBlueprintsSql =
  'SELECT id, title, description, author, created_at, entity_kind, game_version_major, game_version_minor, game_version_patch, game_version_dev, icons FROM blueprints';

export type VersionFilter = {
  major: number;
  minor?: number;
  patch?: number;
  exact: boolean;
};

type SearchBlueprintsInput = {
  query: string;
  version?: VersionFilter;
};

// Builds the version WHERE fragment for whatever prefix of major/minor/patch
// is selected. `exact` matches those fields precisely (trailing fields left
// unselected are wildcards); the default is "this version or later", via
// SQLite's row-value comparison — (major, minor) >= (?, ?) is exactly the
// lexicographic tuple ordering this needs, confirmed against local D1 rather
// than assumed.
const buildVersionCondition = (
  version: VersionFilter,
): { sql: string; params: number[] } => {
  const columns = [
    'game_version_major',
    'game_version_minor',
    'game_version_patch',
  ];
  const values = [version.major];
  if (version.minor !== undefined) {
    values.push(version.minor);
    if (version.patch !== undefined) {
      values.push(version.patch);
    }
  }
  const selectedColumns = columns.slice(0, values.length);

  if (version.exact) {
    return {
      params: values,
      sql: selectedColumns.map((column) => `${column} = ?`).join(' AND '),
    };
  }

  return {
    params: values,
    sql: `(${selectedColumns.join(', ')}) >= (${selectedColumns.map(() => '?').join(', ')})`,
  };
};

export const searchBlueprints = createServerFn({ method: 'GET' })
  .validator((input: SearchBlueprintsInput) => input)
  .handler(async ({ data: input }): Promise<BlueprintSummary[]> => {
    const trimmedQuery = input.query.trim();
    const versionCondition =
      input.version && buildVersionCondition(input.version);

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (trimmedQuery) {
      conditions.push('title LIKE ?');
      params.push(`%${trimmedQuery}%`);
    }
    if (versionCondition) {
      conditions.push(versionCondition.sql);
      params.push(...versionCondition.params);
    }

    const sql =
      conditions.length > 0
        ? `${selectBlueprintsSql} WHERE ${conditions.join(' AND ')}`
        : selectBlueprintsSql;

    const { results } = await env.DB.prepare(sql)
      .bind(...params)
      .all<BlueprintRow>();

    return results.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      author: row.author,
      uploadedAt: row.created_at,
      entityKind: row.entity_kind,
      gameVersion: {
        major: row.game_version_major,
        minor: row.game_version_minor,
        patch: row.game_version_patch,
        dev: row.game_version_dev,
      },
      icons: JSON.parse(row.icons),
    }));
  });

export const searchBlueprintsQueryOptions = (input: SearchBlueprintsInput) =>
  queryOptions({
    queryKey: [
      'blueprints',
      'search',
      input.query,
      input.version?.major,
      input.version?.minor,
      input.version?.patch,
      input.version?.exact,
    ],
    queryFn: () => searchBlueprints({ data: input }),
  });

export type AvailableGameVersion = Pick<
  GameVersion,
  'major' | 'minor' | 'patch'
>;

const selectDistinctGameVersionsSql =
  'SELECT DISTINCT game_version_major, game_version_minor, game_version_patch FROM blueprints';

export const getAvailableGameVersions = createServerFn({
  method: 'GET',
}).handler(async (): Promise<AvailableGameVersion[]> => {
  const { results } = await env.DB.prepare(selectDistinctGameVersionsSql).all<{
    game_version_major: number;
    game_version_minor: number;
    game_version_patch: number;
  }>();

  return results.map((row) => ({
    major: row.game_version_major,
    minor: row.game_version_minor,
    patch: row.game_version_patch,
  }));
});

export const availableGameVersionsQueryOptions = () =>
  queryOptions({
    queryKey: ['blueprints', 'available-versions'],
    queryFn: () => getAvailableGameVersions(),
  });
