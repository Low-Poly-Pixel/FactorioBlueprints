import type { SyntheticEvent } from 'react'

import type { ResolvedBlueprintIcon } from '../blueprint/icons'

const gridPositionByIndex: Record<number, string> = {
  1: 'col-start-1 row-start-1',
  2: 'col-start-2 row-start-1',
  3: 'col-start-1 row-start-2',
  4: 'col-start-2 row-start-2',
}

const hideOnError = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.style.visibility = 'hidden'
}

type SingleEntityIconProps = {
  icon: ResolvedBlueprintIcon
  fillSlot: boolean
}

export const SingleEntityIcon = ({ icon, fillSlot }: SingleEntityIconProps) =>
  fillSlot ? (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: onError is an image-load failure event, not a user interaction
    <img
      alt={icon.name}
      className="col-span-2 row-span-2 size-full p-0.5"
      onError={hideOnError}
      src={icon.url}
    />
  ) : (
    <div
      className={`flex items-center justify-center ${gridPositionByIndex[icon.index]}`}
    >
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: onError is an image-load failure event, not a user interaction */}
      <img
        alt={icon.name}
        className="size-10/12"
        onError={hideOnError}
        src={icon.url}
      />
    </div>
  )
