import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { BrowsePage } from '../features/browse/BrowsePage';
import {
  availableGameVersionsQueryOptions,
  searchBlueprintsQueryOptions,
} from '../features/browse/searchBlueprints';
import { getVersionFilterFromSearch } from '../features/browse/versionFilter';

// Search-param input is user-controlled (a hand-edited/shared URL), so it's
// validated at this boundary like any other external input — see
// shared/blueprint/rawPayloadSchema.ts for the same Zod-at-the-boundary
// pattern applied to blueprint uploads.
const browseSearchSchema = z.object({
  entityKind: z
    .enum([
      'blueprint',
      'blueprint_book',
      'upgrade_planner',
      'deconstruction_planner',
    ])
    .optional(),
  q: z.string().optional(),
  versionMajor: z.number().int().optional(),
  versionMinor: z.number().int().optional(),
  versionPatch: z.number().int().optional(),
});

export type BrowseSearch = z.infer<typeof browseSearchSchema>;

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): BrowseSearch =>
    browseSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ context: { queryClient }, deps }) =>
    Promise.all([
      queryClient.query({
        ...searchBlueprintsQueryOptions({
          entityKind: deps.search.entityKind,
          query: deps.search.q ?? '',
          version: getVersionFilterFromSearch(deps.search),
        }),
        staleTime: 'static',
      }),
      queryClient.query({
        ...availableGameVersionsQueryOptions(),
        staleTime: 'static',
      }),
    ]),
  component: BrowsePage,
});
