export type GameVersion = {
  major: number;
  minor: number;
  patch: number;
  dev: number;
};

export const unpackGameVersion = (packed: number): GameVersion => ({
  major: Math.floor(packed / 2 ** 48) % 65536,
  minor: Math.floor(packed / 2 ** 32) % 65536,
  patch: Math.floor(packed / 2 ** 16) % 65536,
  dev: packed % 65536,
});
