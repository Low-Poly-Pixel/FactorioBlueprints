import { useNavigate, useSearch } from '@tanstack/react-router';

import type { AvailableGameVersion } from '@/api/searchBlueprints.functions';
import { FilterSelectField } from './FilterSelectField';
import {
  decodeVersionLine,
  getAvailablePatches,
  getVersionLineValue,
  versionLineOptions,
} from './versionFilter';

type BrowseVersionFilterProps = {
  availableVersions: AvailableGameVersion[];
};

export const BrowseVersionFilter = ({
  availableVersions,
}: BrowseVersionFilterProps) => {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });

  const setSearch = (changes: Partial<typeof search>) =>
    navigate({
      search: (previous) => ({ ...previous, page: undefined, ...changes }),
      viewTransition: false,
    });

  const versionLineValue = getVersionLineValue(
    search.versionMajor,
    search.versionMinor,
  );

  return (
    <>
      <FilterSelectField
        ariaLabel="Filter by version"
        onChange={(value) => {
          const decoded = value ? decodeVersionLine(value) : undefined;
          setSearch({
            versionMajor: decoded?.major,
            versionMinor: decoded?.minor,
            versionPatch: undefined,
          });
        }}
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
