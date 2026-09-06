import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { BrowsePage } from '../features/browse/BrowsePage';
import {
  availableGameVersionsQueryOptions,
  searchBlueprintsQueryOptions,
} from '../features/browse/searchBlueprints';
import { getVersionFilterFromSearch } from '../features/browse/versionFilter';

// Search-param input is user-controlled (a hand-edited/shared URL, or a
// stale bookmark from before a valid value changed), so it's validated at
// this boundary like any other external input — see
// shared/blueprint/rawPayloadSchema.ts for the same Zod-at-the-boundary
// pattern applied to blueprint uploads.
//
// Each field uses .catch(undefined) rather than plain .optional(): a
// missing field is already fine via .optional(), but a field that's
// *present and wrong* (wrong type, or an entityKind string outside the
// enum) would otherwise make .parse() throw, which TanStack Router doesn't
// catch — it crashes the whole route with an unstyled error dump instead
// of just ignoring that one bad filter. Confirmed by hitting
// ?entityKind=nonsense and ?versionMajor=hello directly before fixing.
const browseSearchSchema = z.object({
  entityKind: z
    .enum([
      'blueprint',
      'blueprint_book',
      'upgrade_planner',
      'deconstruction_planner',
    ])
    .optional()
    .catch(undefined),
  q: z.string().optional().catch(undefined),
  versionMajor: z.number().int().optional().catch(undefined),
  versionMinor: z.number().int().optional().catch(undefined),
  versionPatch: z.number().int().optional().catch(undefined),
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
