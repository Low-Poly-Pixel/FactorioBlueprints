import { useEffect, useRef, useState } from 'react';

// Keeps a `true` value visible for at least minMs once it flips true, even
// if isActive flips back to false sooner — local D1 queries resolve fast
// enough that a naive isActive-driven skeleton would flicker for a handful
// of milliseconds instead of being a visible, intentional loading state.
//
// Both transitions go through useEffect rather than adjusting state (or
// mutating activatedAt) directly during render. This component tree
// suspends (BrowsePage calls useSuspenseQuery twice), and React can
// legitimately discard/re-run a render pass when a component suspends —
// ref mutations made during a discarded pass are NOT rolled back, which
// previously corrupted activatedAt and made the minimum-duration hold fire
// early. Effects only run for renders that actually commit, so they don't
// have this failure mode.
export const useMinimumDuration = (
  isActive: boolean,
  minMs: number,
): boolean => {
  const [shouldShow, setShouldShow] = useState(isActive);
  const activatedAt = useRef<number | null>(isActive ? Date.now() : null);

  useEffect(() => {
    if (isActive) {
      activatedAt.current = Date.now();
      setShouldShow(true);
      return;
    }

    const elapsedMs = activatedAt.current
      ? Date.now() - activatedAt.current
      : minMs;
    const remainingMs = Math.max(minMs - elapsedMs, 0);
    const timeout = setTimeout(() => setShouldShow(false), remainingMs);
    return () => clearTimeout(timeout);
  }, [isActive, minMs]);

  return shouldShow;
};
