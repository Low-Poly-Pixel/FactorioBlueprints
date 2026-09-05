import { createFileRoute } from '@tanstack/react-router';

import { BrowsePage } from '../features/browse/BrowsePage';
import { searchBlueprintsQueryOptions } from '../features/browse/searchBlueprints';

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.query({
      ...searchBlueprintsQueryOptions(),
      staleTime: 'static',
    }),
  component: BrowsePage,
});
