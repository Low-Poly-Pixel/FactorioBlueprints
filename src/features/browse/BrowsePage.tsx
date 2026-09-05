import { useSuspenseQuery } from '@tanstack/react-query'

import { PageContainer } from '../../shared/components/PageContainer'
import { BlueprintResultCard } from './BlueprintResultCard'
import { searchBlueprintsQueryOptions } from './searchBlueprints'

export const BrowsePage = () => {
  const { data: blueprints } = useSuspenseQuery(searchBlueprintsQueryOptions())

  return (
    <PageContainer>
      <ul className="mt-2 flex flex-col gap-3">
        {blueprints.map((blueprint) => (
          <BlueprintResultCard key={blueprint.id} blueprint={blueprint} />
        ))}
      </ul>
    </PageContainer>
  )
}
