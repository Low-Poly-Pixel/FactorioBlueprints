import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouterState, useSearch } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import type { SearchBlueprintsResult } from '@/api/searchBlueprints.functions';
import {
  availableGameVersionsQueryOptions,
  searchBlueprintsQueryOptions,
} from '@/api/searchBlueprints.functions';
import { PageContainer } from '@/shared/components/PageContainer';
import { surfaceDepthClassName } from '@/shared/components/surfaceDepthClassName';
import { BlueprintResultCard } from './BlueprintResultCard';
import { BrowsePaginationFooter } from './BrowsePaginationFooter';
import { BrowseResultsSkeleton } from './BrowseResultsSkeleton';
import { BrowseSubHeader } from './BrowseSubHeader';
import { getPageSizeFromSearch } from './pagination';
import { useMinimumDuration } from './useMinimumDuration';
import { getVersionFilterFromSearch } from './versionFilter';

const skeletonMinDurationMs = 300;

// A route-level navigation (any filter/search/page change) is in flight for
// this whole window, but the loader blocks the route from committing until
// it resolves — so by the time this component re-renders with new search
// params, results are already fetched. useRouterState's isLoading is the
// one signal that actually reflects that in-flight window, independent of
// the query itself ever observably being "fetching" from in here.
const getResultsSection = (
  showSkeleton: boolean,
  pageSize: number,
  results: SearchBlueprintsResult,
): ReactNode => {
  if (!showSkeleton && results.items.length === 0) {
    return (
      <div
        className={`rounded-md border border-border bg-card p-8 text-center text-muted-foreground ${surfaceDepthClassName}`}
      >
        No Results Found
      </div>
    );
  }

  return showSkeleton ? (
    <BrowseResultsSkeleton count={pageSize} />
  ) : (
    <ul className="flex flex-col gap-3">
      {results.items.map((blueprint) => (
        <BlueprintResultCard key={blueprint.id} blueprint={blueprint} />
      ))}
    </ul>
  );
};

export const BrowsePage = () => {
  const search = useSearch({ from: '/' });
  const pageSize = getPageSizeFromSearch(search.pageSize);
  const { data: results } = useSuspenseQuery(
    searchBlueprintsQueryOptions({
      entityKind: search.entityKind,
      page: search.page ?? 1,
      pageSize,
      query: search.q ?? '',
      version: getVersionFilterFromSearch(search),
    }),
  );
  const { data: availableVersions } = useSuspenseQuery(
    availableGameVersionsQueryOptions(),
  );
  const isNavigating = useRouterState({ select: (state) => state.isLoading });
  const showSkeleton = useMinimumDuration(isNavigating, skeletonMinDurationMs);
  const hasResults = showSkeleton || results.items.length > 0;

  return (
    <>
      <BrowseSubHeader availableVersions={availableVersions} />
      <PageContainer>
        {getResultsSection(showSkeleton, pageSize, results)}
      </PageContainer>
      {hasResults && (
        <BrowsePaginationFooter
          currentPage={results.page}
          disabled={showSkeleton}
          totalPages={results.totalPages}
        />
      )}
    </>
  );
};
