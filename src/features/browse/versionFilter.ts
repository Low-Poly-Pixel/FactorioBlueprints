import type { AvailableGameVersion, VersionFilter } from './searchBlueprints';

export type VersionSearchParams = {
  versionExact?: boolean;
  versionMajor?: number;
  versionMinor?: number;
  versionPatch?: number;
};

// Minor/patch only count if every field before them is also selected —
// matches the cascading dropdown UI (you can't pick a sub-version without a
// version first) and keeps a hand-edited URL from misaligning a lone
// versionPatch with the wrong SQL column in buildVersionCondition.
export const getVersionFilterFromSearch = (
  search: VersionSearchParams,
): VersionFilter | undefined => {
  if (search.versionMajor === undefined) {
    return undefined;
  }

  return {
    exact: search.versionExact ?? false,
    major: search.versionMajor,
    minor: search.versionMinor,
    patch: search.versionMinor !== undefined ? search.versionPatch : undefined,
  };
};

const getUniqueSorted = (values: number[]): number[] =>
  [...new Set(values)].sort((a, b) => b - a);

export const getAvailableMajors = (
  versions: AvailableGameVersion[],
): number[] => getUniqueSorted(versions.map((version) => version.major));

export const getAvailableMinors = (
  versions: AvailableGameVersion[],
  major: number | undefined,
): number[] =>
  major === undefined
    ? []
    : getUniqueSorted(
        versions
          .filter((version) => version.major === major)
          .map((version) => version.minor),
      );

export const getAvailablePatches = (
  versions: AvailableGameVersion[],
  major: number | undefined,
  minor: number | undefined,
): number[] =>
  major === undefined || minor === undefined
    ? []
    : getUniqueSorted(
        versions
          .filter(
            (version) => version.major === major && version.minor === minor,
          )
          .map((version) => version.patch),
      );
