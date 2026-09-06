import { env } from 'cloudflare:workers';
import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { resolvePagination } from '@/features/browse/pagination';
import type { GameVersion } from '@/shared/blueprint/exportStringDecoder';
import type { BlueprintFilters } from './blueprintConditions.server';
import { buildBlueprintConditions } from './blueprintConditions.server';
import type { BlueprintRow, BlueprintSummary } from './blueprintRow.server';
import { mapBlueprintRow } from './blueprintRow.server';

// Most recent upload first — the default and, per direct request, the rule
// whenever there's no title search to imply any other relevance ordering.
const selectBlueprintsSql =
  'SELECT id, title, description, author, created_at, entity_kind, game_version_major, game_version_minor, game_version_patch, game_version_dev, icons FROM blueprints';

type SearchBlueprintsInput = BlueprintFilters & {
  page: number;
  pageSize: number;
};

export type SearchBlueprintsResult = {
  items: BlueprintSummary[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const searchBlueprints = createServerFn({ method: 'GET' })
  .validator((input: SearchBlueprintsInput) => input)
  .handler(async ({ data: input }): Promise<SearchBlueprintsResult> => {
    const { sql: whereSql, params } = buildBlueprintConditions(input);

    const countRow = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM blueprints${whereSql}`,
    )
      .bind(...params)
      .first<{ count: number }>();
    const totalCount = countRow?.count ?? 0;

    // input crosses an RPC boundary a hand-crafted request can hit directly,
    // bypassing both the route's URL-search-param schema and this page's
    // own dropdowns — resolvePagination re-validates page/pageSize here
    // rather than trusting them, same reasoning as routes/index.tsx's
    // browseSearchSchema.
    const { offset, page, pageSize, totalPages } = resolvePagination({
      page: input.page,
      pageSize: input.pageSize,
      totalCount,
    });

    const { results } = await env.DB.prepare(
      `${selectBlueprintsSql}${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(...params, pageSize, offset)
      .all<BlueprintRow>();

    return {
      items: results.map(mapBlueprintRow),
      page,
      pageSize,
      totalCount,
      totalPages,
    };
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
      input.entityKind,
      input.page,
      input.pageSize,
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
