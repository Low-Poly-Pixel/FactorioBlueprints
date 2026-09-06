import type { FilterSelectOption } from './FilterSelectField';
import { FACTORIO_VERSION_LINES } from './factorioVersionLines';
import type { AvailableGameVersion, VersionFilter } from './searchBlueprints';

export type VersionSearchParams = {
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
    major: search.versionMajor,
    minor: search.versionMinor,
    patch: search.versionMinor !== undefined ? search.versionPatch : undefined,
  };
};

// Major and minor are combined into one dropdown value ("2.1") — Factorio
// has too few of either individually to justify two separate dropdowns.
// See factorioVersionLines.ts for the recorded list this is built from.
export const encodeVersionLine = (major: number, minor: number): string =>
  `${major}.${minor}`;

export const decodeVersionLine = (
  value: string,
): { major: number; minor: number } => {
  const [major, minor] = value.split('.').map(Number);
  return { major, minor };
};

const isRecordedVersionLine = (major: number, minor: number): boolean =>
  FACTORIO_VERSION_LINES.some(([m, n]) => m === major && n === minor);

// Only produces a value when major/minor form an actual recorded Factorio
// version line. An out-of-range value (e.g. ?versionMajor=3 — a well-typed
// integer, just not a real version) has no matching dropdown option, and
// Radix's SelectValue has nothing to render for an unmatched value, so the
// trigger goes blank instead of falling back to its placeholder. Treating
// only recognized combos as "selected" keeps the dropdown's visible state
// (placeholder vs. value, clear button shown vs. hidden) consistent with
// what's actually a real, selectable option.
export const getVersionLineValue = (
  major: number | undefined,
  minor: number | undefined,
): string | undefined =>
  major !== undefined && isRecordedVersionLine(major, minor ?? 0)
    ? encodeVersionLine(major, minor ?? 0)
    : undefined;

export const versionLineOptions: FilterSelectOption[] = [
  ...FACTORIO_VERSION_LINES,
]
  // Newest first — the most likely versions to filter by.
  .sort(([aMajor, aMinor], [bMajor, bMinor]) =>
    aMajor === bMajor ? bMinor - aMinor : bMajor - aMajor,
  )
  .map(([major, minor]) => {
    const label = encodeVersionLine(major, minor);
    return { label, value: label };
  });

const getUniqueSorted = (values: number[]): number[] =>
  [...new Set(values)].sort((a, b) => b - a);

export const getAvailablePatches = (
  versions: AvailableGameVersion[],
  major: number | undefined,
  minor: number | undefined,
): FilterSelectOption[] =>
  major === undefined || minor === undefined
    ? []
    : getUniqueSorted(
        versions
          .filter(
            (version) => version.major === major && version.minor === minor,
          )
          .map((version) => version.patch),
      ).map((patch) => ({ label: String(patch), value: String(patch) }));
