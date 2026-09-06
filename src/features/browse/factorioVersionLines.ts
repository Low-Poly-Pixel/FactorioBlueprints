// Every major.minor version line Factorio has ever shipped, oldest first.
// Source: https://wiki.factorio.com/Version_history — each major.minor line
// has its own patch-changelog page (e.g. Version_history/0.17.0). Verified
// by fetching the page and extracting its own version-index links directly,
// not by trusting a summary, since the exact boundaries matter here.
// Minimum: 0.1. Maximum: 2.1 (as of this recording — Factorio adds a new
// line at most a few times a year, so this needs an occasional manual bump,
// not a live lookup).
export const FACTORIO_VERSION_LINES: readonly [major: number, minor: number][] =
  [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [0, 8],
    [0, 9],
    [0, 10],
    [0, 11],
    [0, 12],
    [0, 13],
    [0, 14],
    [0, 15],
    [0, 16],
    [0, 17],
    [0, 18],
    [1, 0],
    [1, 1],
    [2, 0],
    [2, 1],
  ];
