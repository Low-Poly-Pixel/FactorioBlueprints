import type { EntityKind } from '../blueprint/exportStringDecoder'
import {
  entityKindIconUrls,
  type ResolvedBlueprintIcon,
} from '../blueprint/icons'
import { SingleEntityIcon } from './SingleEntityIcon'

// 'card' backs the browse/detail summary card slot; 'tree' is the smaller
// preset for blueprint-book tree rows. The two aren't a scaled version of
// each other — Tailwind's px-based offsets below (inset, translate) don't
// scale proportionally with size, so each preset carries its own hand-tuned
// values rather than one computed from the other.
export type EntityIconSize = 'card' | 'tree'

const slotSizeClassBySize: Record<EntityIconSize, string> = {
  card: 'size-20',
  tree: 'size-8',
}

const slotPaddingByEntityKindAndSize: Record<
  EntityIconSize,
  Record<EntityKind, string>
> = {
  card: {
    blueprint: 'p-0.5',
    blueprint_book: 'overflow-hidden p-3',
    upgrade_planner: 'p-0.5',
    deconstruction_planner: 'p-0.5',
  },
  tree: {
    blueprint: 'p-px',
    blueprint_book: 'overflow-hidden p-1',
    upgrade_planner: 'p-px',
    deconstruction_planner: 'p-px',
  },
}

const baseIconInsetBySize: Record<EntityIconSize, string> = {
  card: 'inset-1 size-[calc(100%-0.5rem)]',
  tree: 'inset-0.5 size-[calc(100%-0.25rem)]',
}

const baseIconScaleByEntityKind: Record<EntityKind, string> = {
  blueprint: '',
  blueprint_book: 'scale-[1.1]',
  upgrade_planner: '',
  deconstruction_planner: '',
}

const iconGridPaddingBySize: Record<EntityIconSize, string> = {
  card: 'p-1',
  tree: 'p-0.5',
}

const iconGridOffsetByEntityKindAndSize: Record<
  EntityIconSize,
  Record<EntityKind, string>
> = {
  card: {
    blueprint: '',
    blueprint_book: '-translate-y-[6px] translate-x-[2px]',
    upgrade_planner: '',
    deconstruction_planner: '',
  },
  tree: {
    blueprint: '',
    blueprint_book: '-translate-y-px translate-x-px',
    upgrade_planner: '',
    deconstruction_planner: '',
  },
}

type EntityIconsProps = {
  entityKind: EntityKind
  icons: ResolvedBlueprintIcon[]
  size: EntityIconSize
}

export const EntityIcons = ({ entityKind, icons, size }: EntityIconsProps) => (
  <div
    className={`relative rounded-md ${slotSizeClassBySize[size]} bg-card ${slotPaddingByEntityKindAndSize[size][entityKind]}`}
  >
    <img
      alt=""
      className={`absolute ${baseIconInsetBySize[size]} ${baseIconScaleByEntityKind[entityKind]}`}
      src={entityKindIconUrls[entityKind]}
    />
    <div
      className={`relative grid size-full grid-cols-2 grid-rows-2 ${iconGridPaddingBySize[size]} ${iconGridOffsetByEntityKindAndSize[size][entityKind]}`}
    >
      {icons.map((icon) => (
        <SingleEntityIcon
          fillSlot={icons.length === 1}
          icon={icon}
          key={icon.index}
        />
      ))}
    </div>
  </div>
)
