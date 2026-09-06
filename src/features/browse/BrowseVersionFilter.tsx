import { useNavigate, useSearch } from '@tanstack/react-router';

import { Checkbox } from '../../shared/components/shadcn/checkbox';
import { Label } from '../../shared/components/shadcn/label';
import type { AvailableGameVersion } from './searchBlueprints';
import { VersionSelectField } from './VersionSelectField';
import {
  getAvailableMajors,
  getAvailableMinors,
  getAvailablePatches,
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

  return (
    <div className="flex items-center gap-2">
      <VersionSelectField
        anyLabel="Any version"
        ariaLabel="Filter by version"
        onChange={(versionMajor) =>
          setSearch({
            versionMajor,
            versionMinor: undefined,
            versionPatch: undefined,
          })
        }
        options={getAvailableMajors(availableVersions)}
        placeholder="Version"
        value={search.versionMajor}
      />
      <VersionSelectField
        anyLabel="Any sub-version"
        ariaLabel="Filter by sub-version"
        disabled={search.versionMajor === undefined}
        onChange={(versionMinor) =>
          setSearch({ versionMinor, versionPatch: undefined })
        }
        options={getAvailableMinors(availableVersions, search.versionMajor)}
        placeholder="Sub-version"
        value={search.versionMinor}
      />
      <VersionSelectField
        anyLabel="Any patch"
        ariaLabel="Filter by patch version"
        disabled={search.versionMinor === undefined}
        onChange={(versionPatch) => setSearch({ versionPatch })}
        options={getAvailablePatches(
          availableVersions,
          search.versionMajor,
          search.versionMinor,
        )}
        placeholder="Patch"
        value={search.versionPatch}
      />
      <div className="flex items-center gap-2">
        <Checkbox
          checked={search.versionExact ?? false}
          disabled={search.versionMajor === undefined}
          id="version-exact"
          onCheckedChange={(checked) =>
            setSearch({ versionExact: checked === true ? true : undefined })
          }
        />
        <Label
          className="text-muted-foreground text-sm"
          htmlFor="version-exact"
        >
          Exact
        </Label>
      </div>
    </div>
  );
};
