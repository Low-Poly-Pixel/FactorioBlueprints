import type { AvailableGameVersion } from '@/api/searchBlueprints.functions';
import { SubHeader } from '@/shared/components/SubHeader';
import { BrowseEntityKindFilter } from './BrowseEntityKindFilter';
import { BrowseSearchInput } from './BrowseSearchInput';
import { BrowseVersionFilter } from './BrowseVersionFilter';

type BrowseSubHeaderProps = {
  availableVersions: AvailableGameVersion[];
};

export const BrowseSubHeader = ({
  availableVersions,
}: BrowseSubHeaderProps) => (
  <SubHeader>
    <BrowseSearchInput />
    <BrowseEntityKindFilter />
    <BrowseVersionFilter availableVersions={availableVersions} />
  </SubHeader>
);
