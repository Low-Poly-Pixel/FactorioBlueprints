import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { PageContainer } from '../../shared/components/PageContainer';
import { BlueprintResultCard } from './BlueprintResultCard';
import { BrowseSearchInput } from './BrowseSearchInput';
import { BrowseVersionFilter } from './BrowseVersionFilter';
import {
  availableGameVersionsQueryOptions,
  searchBlueprintsQueryOptions,
} from './searchBlueprints';
import { getVersionFilterFromSearch } from './versionFilter';

export const BrowsePage = () => {
  const search = useSearch({ from: '/' });
  const { data: blueprints } = useSuspenseQuery(
    searchBlueprintsQueryOptions({
      query: search.q ?? '',
      version: getVersionFilterFromSearch(search),
    }),
  );
  const { data: availableVersions } = useSuspenseQuery(
    availableGameVersionsQueryOptions(),
  );

  return (
    <PageContainer>
      <div className="flex gap-3">
        <BrowseSearchInput />
        <BrowseVersionFilter availableVersions={availableVersions} />
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {blueprints.map((blueprint) => (
          <BlueprintResultCard key={blueprint.id} blueprint={blueprint} />
        ))}
      </ul>
    </PageContainer>
  );
};
