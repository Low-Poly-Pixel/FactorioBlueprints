import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { BrowsePage } from '../features/browse/BrowsePage';
import { searchBlueprintsQueryOptions } from '../features/browse/searchBlueprints';

// Search-param input is user-controlled (a hand-edited/shared URL), so it's
// validated at this boundary like any other external input — see
// shared/blueprint/rawPayloadSchema.ts for the same Zod-at-the-boundary
// pattern applied to blueprint uploads.
const browseSearchSchema = z.object({
  q: z.string().optional(),
});

type BrowseSearch = z.infer<typeof browseSearchSchema>;

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): BrowseSearch =>
    browseSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.query({
      ...searchBlueprintsQueryOptions(deps.q ?? ''),
      staleTime: 'static',
    }),
  component: BrowsePage,
});
