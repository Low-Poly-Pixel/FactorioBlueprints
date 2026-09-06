import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { PageContainer } from '../../shared/components/PageContainer';
import { BlueprintResultCard } from './BlueprintResultCard';
import { BrowseSearchInput } from './BrowseSearchInput';
import { searchBlueprintsQueryOptions } from './searchBlueprints';

export const BrowsePage = () => {
  const { q } = useSearch({ from: '/' });
  const { data: blueprints } = useSuspenseQuery(
    searchBlueprintsQueryOptions(q ?? ''),
  );

  return (
    <PageContainer>
      <BrowseSearchInput />
      <ul className="mt-4 flex flex-col gap-3">
        {blueprints.map((blueprint) => (
          <BlueprintResultCard key={blueprint.id} blueprint={blueprint} />
        ))}
      </ul>
    </PageContainer>
  );
};
