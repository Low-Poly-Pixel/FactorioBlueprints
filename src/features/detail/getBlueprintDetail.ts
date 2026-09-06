import { env } from 'cloudflare:workers';
import { createServerFn } from '@tanstack/react-start';

import type {
  EntityKind,
  GameVersion,
} from '../../shared/blueprint/exportStringDecoder';
import type {
  ResolvedBlueprintIcon,
  ResolvedBlueprintTreeNode,
} from '../../shared/blueprint/icons';

export type BlueprintDetail = {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  uploadedAt: number;
  entityKind: EntityKind;
  gameVersion: GameVersion;
  icons: ResolvedBlueprintIcon[];
  children: ResolvedBlueprintTreeNode[];
  exportString: string;
};

type BlueprintDetailRow = {
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
  tree: string;
  export_string: string;
};

const selectBlueprintByIdSql =
  'SELECT id, title, description, author, created_at, entity_kind, game_version_major, game_version_minor, game_version_patch, game_version_dev, icons, tree, export_string FROM blueprints WHERE id = ?';

export const getBlueprintDetail = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<BlueprintDetail | null> => {
    const row = await env.DB.prepare(selectBlueprintByIdSql)
      .bind(id)
      .first<BlueprintDetailRow>();

    return row
      ? {
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
          children: JSON.parse(row.tree),
          exportString: row.export_string,
        }
      : null;
  });
