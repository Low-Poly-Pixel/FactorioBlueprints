import type {
  EntityKind,
  GameVersion,
} from '@/shared/blueprint/exportStringDecoder';
import { formatTimeSinceUpload } from '@/shared/blueprint/formatTimeSinceUpload';
import type { ResolvedBlueprintIcon } from '@/shared/blueprint/icons';
import { EntityIcons } from './EntityIcons';
import { FactorioRichText } from './FactorioRichText';

// Structural shape only — both BlueprintSummary (browse) and BlueprintDetail
// (detail) satisfy this without needing to import from each other's feature.
export type BlueprintCardData = {
  title: string;
  entityKind: EntityKind;
  gameVersion: GameVersion;
  uploadedAt: number;
  author: string | null;
  icons: ResolvedBlueprintIcon[];
};

type BlueprintSummaryCardProps = {
  blueprint: BlueprintCardData;
};

const entityKindLabels: Record<EntityKind, string> = {
  blueprint: 'Blueprint',
  blueprint_book: 'Blueprint Book',
  upgrade_planner: 'Upgrade Planner',
  deconstruction_planner: 'Deconstruction Planner',
};

const entityKindTextColor: Record<EntityKind, string> = {
  blueprint: 'text-info',
  blueprint_book: 'text-info',
  upgrade_planner: 'text-success',
  deconstruction_planner: 'text-destructive',
};

const metaTextClassName = 'text-muted-foreground text-sm';
const metaHighlightClassName = 'text-primary';

// 0.0.0 has never been a real Factorio version (even the earliest recorded
// line is 0.1 — see factorioVersionLines.ts), so this means the export
// string's own version field was never set, not that it really is 0.0.0.
const isMissingVersion = (version: GameVersion): boolean =>
  version.major === 0 && version.minor === 0 && version.patch === 0;

export const BlueprintSummaryCard = ({
  blueprint,
}: BlueprintSummaryCardProps) => (
  <div className="flex items-center gap-4">
    <EntityIcons
      entityKind={blueprint.entityKind}
      icons={blueprint.icons}
      size="card"
    />
    <div className="flex flex-col gap-1 ">
      <h2 className="font-medium text-lg text-foreground">
        <FactorioRichText text={blueprint.title} />
      </h2>
      <div className="flex gap-2">
        <p className={`text-sm ${entityKindTextColor[blueprint.entityKind]}`}>
          {entityKindLabels[blueprint.entityKind]}
        </p>
        <p className={metaTextClassName}>
          {!isMissingVersion(blueprint.gameVersion) ? (
            <>
              v{blueprint.gameVersion.major}.{blueprint.gameVersion.minor}.
              {blueprint.gameVersion.patch}
            </>
          ) : (
            'Missing Version'
          )}
        </p>
      </div>
      <p className={metaTextClassName}>
        Uploaded{' '}
        <span className={metaHighlightClassName}>
          {formatTimeSinceUpload(blueprint.uploadedAt)}
        </span>{' '}
        ago
        {blueprint.author && (
          <>
            {' '}
            by{' '}
            <span className={metaHighlightClassName}>{blueprint.author}</span>
          </>
        )}
      </p>
    </div>
  </div>
);
