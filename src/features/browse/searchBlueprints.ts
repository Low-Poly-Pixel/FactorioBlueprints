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

export const searchBlueprints = createServerFn({ method: 'GET' }).handler(
  async (): Promise<BlueprintSummary[]> => {
    const { results } =
      await env.DB.prepare(selectBlueprintsSql).all<BlueprintRow>();

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
  },
);

export const searchBlueprintsQueryOptions = () =>
  queryOptions({
    queryKey: ['blueprints', 'search'],
    queryFn: () => searchBlueprints(),
  });
