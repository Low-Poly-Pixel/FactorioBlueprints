import type { EntityKind, GameVersion } from '../blueprint/exportStringDecoder'
import { formatTimeSinceUpload } from '../blueprint/formatTimeSinceUpload'
import type { ResolvedBlueprintIcon } from '../blueprint/icons'
import { EntityIcons } from './EntityIcons'

// Structural shape only — both BlueprintSummary (browse) and BlueprintDetail
// (detail) satisfy this without needing to import from each other's feature.
export type BlueprintCardData = {
  title: string
  entityKind: EntityKind
  gameVersion: GameVersion
  uploadedAt: number
  author: string | null
  icons: ResolvedBlueprintIcon[]
}

type BlueprintSummaryCardProps = {
  blueprint: BlueprintCardData
}

const entityKindLabels: Record<EntityKind, string> = {
  blueprint: 'Blueprint',
  blueprint_book: 'Blueprint Book',
  upgrade_planner: 'Upgrade Planner',
  deconstruction_planner: 'Deconstruction Planner',
}

const entityKindTextColor: Record<EntityKind, string> = {
  blueprint: 'text-info',
  blueprint_book: 'text-info',
  upgrade_planner: 'text-success',
  deconstruction_planner: 'text-destructive',
}

const metaTextClassName = 'text-muted-foreground text-sm'
const metaHighlightClassName = 'text-primary'

export const BlueprintSummaryCard = ({
  blueprint,
}: BlueprintSummaryCardProps) => (
  <div className="flex items-center gap-4">
    <EntityIcons
      entityKind={blueprint.entityKind}
      icons={blueprint.icons}
      size="card"
    />
    <div className="flex flex-col gap-1">
      <h2 className="font-semibold text-foreground">{blueprint.title}</h2>
      <div className="flex gap-2">
        <p className={`text-sm ${entityKindTextColor[blueprint.entityKind]}`}>
          {entityKindLabels[blueprint.entityKind]}
        </p>
        <p className={metaTextClassName}>
          {blueprint.gameVersion.major}.{blueprint.gameVersion.minor}.
          {blueprint.gameVersion.patch}
        </p>
      </div>
      <p className={metaTextClassName}>
        Uploaded{' '}
        <span className={metaHighlightClassName}>
          {formatTimeSinceUpload(blueprint.uploadedAt)}
        </span>{' '}
        ago by{' '}
        <span className={metaHighlightClassName}>
          {blueprint.author ?? 'Unknown'}
        </span>
      </p>
    </div>
  </div>
)
