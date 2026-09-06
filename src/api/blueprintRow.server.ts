import type {
  EntityKind,
  GameVersion,
} from '@/shared/blueprint/exportStringDecoder';
import type { ResolvedBlueprintIcon } from '@/shared/blueprint/icons';

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
// convention — mapBlueprintRow below is the one place that translates into
// BlueprintSummary, rather than pretending this boundary looks like that.
export type BlueprintRow = {
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

export const mapBlueprintRow = (row: BlueprintRow): BlueprintSummary => ({
  author: row.author,
  description: row.description,
  entityKind: row.entity_kind,
  gameVersion: {
    major: row.game_version_major,
    minor: row.game_version_minor,
    patch: row.game_version_patch,
    dev: row.game_version_dev,
  },
  icons: JSON.parse(row.icons),
  id: row.id,
  title: row.title,
  uploadedAt: row.created_at,
});
