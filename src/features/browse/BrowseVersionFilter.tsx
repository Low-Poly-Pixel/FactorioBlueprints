import { useNavigate, useSearch } from '@tanstack/react-router';

import { FilterSelectField } from './FilterSelectField';
import type { AvailableGameVersion } from './searchBlueprints';
import {
  decodeVersionLine,
  encodeVersionLine,
  getAvailablePatches,
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
    navigate({ search: (previous) => ({ ...previous, ...changes }) });

  const versionLineValue =
    search.versionMajor === undefined
      ? undefined
      : encodeVersionLine(search.versionMajor, search.versionMinor ?? 0);

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
        widthClassName="w-28"
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
        ).map((patch) => ({ label: String(patch), value: String(patch) }))}
        placeholder="Patch"
        value={search.versionPatch?.toString()}
        widthClassName="w-28"
      />
    </>
  );
};
