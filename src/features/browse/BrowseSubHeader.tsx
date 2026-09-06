import type { AvailableGameVersion } from '@/api/searchBlueprints.functions';
import { BrowseEntityKindFilter } from './BrowseEntityKindFilter';
import { BrowseSearchInput } from './BrowseSearchInput';
import { BrowseVersionFilter } from './BrowseVersionFilter';

type BrowseSubHeaderProps = {
  availableVersions: AvailableGameVersion[];
};

// Sits directly under the main header, outside PageContainer's scrollable
// <main> (see __root.tsx), so the search/filter controls stay visible and
// never scroll away regardless of how long the results list gets.
export const BrowseSubHeader = ({
  availableVersions,
}: BrowseSubHeaderProps) => (
  <div className="border-border border-b bg-card/70">
    <div className="mx-auto flex max-w-7xl items-center gap-2 px-8 py-4">
      <BrowseSearchInput />
      <BrowseEntityKindFilter />
      <BrowseVersionFilter availableVersions={availableVersions} />
    </div>
  </div>
);
