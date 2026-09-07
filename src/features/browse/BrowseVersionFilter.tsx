import { useNavigate, useSearch } from '@tanstack/react-router';

import type { AvailableGameVersion } from '@/api/searchBlueprints.functions';
import type { BrowseSearch } from '@/routes/index';
import { FilterSelectField } from './FilterSelectField';
import {
  decodeVersionLine,
  getAvailablePatches,
  getVersionLineValue,
  MISSING_VERSION_VALUE,
  versionLineOptions,
} from './versionFilter';

type BrowseVersionFilterProps = {
  availableVersions: AvailableGameVersion[];
};

type SetSearch = (changes: Partial<BrowseSearch>) => void;

// Missing-version is a sentinel dropdown value rather than a real version
// line, so it takes a different path than decodeVersionLine below.
const handleVersionLineChange = (
  value: string | undefined,
  setSearch: SetSearch,
) => {
  if (value === MISSING_VERSION_VALUE) {
    setSearch({
      versionMajor: undefined,
      versionMinor: undefined,
      versionMissing: true,
      versionPatch: undefined,
    });
    return;
  }
  const decoded = value ? decodeVersionLine(value) : undefined;
  setSearch({
    versionMajor: decoded?.major,
    versionMinor: decoded?.minor,
    versionMissing: undefined,
    versionPatch: undefined,
  });
};

export const BrowseVersionFilter = ({
  availableVersions,
}: BrowseVersionFilterProps) => {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });

  const setSearch: SetSearch = (changes) =>
    navigate({
      search: (previous) => ({ ...previous, page: undefined, ...changes }),
      viewTransition: false,
    });

  const versionLineValue = getVersionLineValue(
    search.versionMajor,
    search.versionMinor,
    search.versionMissing,
  );

  return (
    <>
      <FilterSelectField
        ariaLabel="Filter by version"
        onChange={(value) => handleVersionLineChange(value, setSearch)}
        options={versionLineOptions}
        placeholder="Version"
        value={versionLineValue}
        widthClassName="w-24"
      />
      <FilterSelectField
        ariaLabel="Filter by patch version"
        disabled={search.versionMajor === undefined}
        disabledTooltip="Select a version first"
        onChange={(value) =>
          setSearch({ versionPatch: value ? Number(value) : undefined })
        }
        options={getAvailablePatches(
          availableVersions,
          search.versionMajor,
          search.versionMinor,
        )}
        placeholder="Patch"
        value={search.versionPatch?.toString()}
        widthClassName="w-24"
      />
    </>
  );
};
