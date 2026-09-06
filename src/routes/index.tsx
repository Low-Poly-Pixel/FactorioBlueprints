import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import {
  availableGameVersionsQueryOptions,
  searchBlueprintsQueryOptions,
} from '@/api/searchBlueprints.functions';
import { BrowsePage } from '@/features/browse/BrowsePage';
import { getPageSizeFromSearch } from '@/features/browse/pagination';
import { getVersionFilterFromSearch } from '@/features/browse/versionFilter';

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
  page: z.number().int().positive().optional().catch(undefined),
  // Membership in {2, 4, 8} is checked at use-site via
  // getPageSizeFromSearch, not here — same reasoning as versionMajor below:
  // a well-typed-but-not-a-real-option value should fall back gracefully
  // rather than throw. This just guards the shape.
  pageSize: z.number().int().positive().optional().catch(undefined),
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
          page: deps.search.page ?? 1,
          pageSize: getPageSizeFromSearch(deps.search.pageSize),
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
