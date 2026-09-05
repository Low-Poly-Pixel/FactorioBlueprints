import { ChevronRight } from 'lucide-react'

import type { EntityKind } from '../../shared/blueprint/exportStringDecoder'
import type { ResolvedBlueprintIcon } from '../../shared/blueprint/icons'
import { EntityIcons } from '../../shared/components/EntityIcons'
import { OpenInBlueprintEditorButton } from './OpenInBlueprintEditorButton'

type BlueprintTreeNodeRowProps = {
  entityKind: EntityKind
  icons: ResolvedBlueprintIcon[]
  title: string
  hasChildren: boolean
  hideIndent: boolean
  isExpanded: boolean
  exportString: string
}

export const BlueprintTreeNodeRow = ({
  entityKind,
  icons,
  title,
  hasChildren,
  hideIndent,
  isExpanded,
  exportString,
}: BlueprintTreeNodeRowProps) => (
  <div className="flex cursor-pointer items-center gap-2 py-1 hover:bg-card">
    {hasChildren && (
      <ChevronRight
        aria-hidden="true"
        className={`size-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
      />
    )}
    {!(hasChildren || hideIndent) && (
      <span aria-hidden="true" className="size-4 shrink-0" />
    )}
    {entityKind === 'blueprint' && (
      <OpenInBlueprintEditorButton exportString={exportString} />
    )}
    <EntityIcons entityKind={entityKind} icons={icons} size="tree" />
    <span className="truncate text-foreground text-sm">{title}</span>
  </div>
)
