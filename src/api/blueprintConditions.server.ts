import type { EntityKind } from '@/shared/blueprint/exportStringDecoder';

export type VersionFilter = {
  major: number;
  minor?: number;
  patch?: number;
};

export type BlueprintFilters = {
  entityKind?: EntityKind;
  query: string;
  version?: VersionFilter;
};

type SqlCondition = { sql: string; params: (string | number)[] };

// Builds the version WHERE fragment for whatever prefix of major/minor/patch
// is selected — an exact match on those fields; trailing fields left
// unselected are wildcards (e.g. major+minor only matches any patch).
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

  return {
    params: values,
    sql: selectedColumns.map((column) => `${column} = ?`).join(' AND '),
  };
};

// Shared between the count query and the page query in searchBlueprints.ts
// so the two can never drift apart and disagree on which rows match.
export const buildBlueprintConditions = (
  filters: BlueprintFilters,
): SqlCondition => {
  const trimmedQuery = filters.query.trim();
  const versionCondition =
    filters.version && buildVersionCondition(filters.version);

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
  if (filters.entityKind) {
    conditions.push('entity_kind = ?');
    params.push(filters.entityKind);
  }

  return conditions.length > 0
    ? { sql: ` WHERE ${conditions.join(' AND ')}`, params }
    : { sql: '', params: [] };
};
