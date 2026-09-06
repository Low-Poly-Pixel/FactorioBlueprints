import { deflateSync, inflateSync } from 'node:zlib';
import { type EntityKind, fallbackTitles } from './entityKind.ts';
import { type GameVersion, unpackGameVersion } from './gameVersion.ts';
import {
  entityKindAndPayload,
  type ItemType,
  type RawPayload,
  topLevelSchema,
} from './rawPayloadSchema.ts';

export type { EntityKind } from './entityKind.ts';
export type { GameVersion } from './gameVersion.ts';
export type { ItemType } from './rawPayloadSchema.ts';

export type BlueprintIcon = {
  type: ItemType;
  name: string;
  index: number;
};

export type DecodedBlueprint = {
  entityKind: EntityKind;
  title: string;
  description: string | null;
  gameVersion: GameVersion;
  exportString: string;
  icons: BlueprintIcon[];
};

export type BlueprintTreeNode = {
  entityKind: EntityKind;
  title: string;
  icons: BlueprintIcon[];
  children: BlueprintTreeNode[];
  exportString: string;
};

// The top-level `{ blueprint: {...} }` / `{ blueprint_book: {...} }` wrapper
// is the only place base64+zlib decoding happens — nested entries inside a
// book's own `blueprints` array are already plain JSON, no re-decoding needed.
const parseBlueprintPayload = (raw: string) => {
  const trimmed = raw.trim();
  const inflated = inflateSync(Buffer.from(trimmed.slice(1), 'base64'));
  const wrapper = topLevelSchema.parse(JSON.parse(inflated.toString('utf8')));
  return { ...entityKindAndPayload(wrapper), trimmed };
};

const extractIcons = (payload: RawPayload): BlueprintIcon[] =>
  (payload.icons ?? []).map((icon) => ({
    type: icon.signal.type ?? 'item',
    name: icon.signal.name,
    index: icon.index,
  }));

export const decodeBlueprintString = (raw: string): DecodedBlueprint => {
  const { entityKind, payload, trimmed } = parseBlueprintPayload(raw);
  return {
    entityKind,
    title: payload.label ?? fallbackTitles[entityKind],
    description: payload.description ?? null,
    gameVersion: unpackGameVersion(payload.version),
    exportString: trimmed,
    icons: extractIcons(payload),
  };
};

// Re-encodes a single nested entry back into its own standalone Factorio
// export string, so a book's individual contents can be linked out to
// externally (e.g. an outside blueprint editor) on their own, not just the
// book as a whole.
const encodeStandaloneBlueprintString = (
  entityKind: EntityKind,
  payload: RawPayload,
): string => {
  const json = JSON.stringify({ [entityKind]: payload });
  const compressed = deflateSync(json);
  return `0${compressed.toString('base64')}`;
};

const buildTreeNode = (
  entityKind: EntityKind,
  payload: RawPayload,
): BlueprintTreeNode => ({
  entityKind,
  title: payload.label ?? fallbackTitles[entityKind],
  icons: extractIcons(payload),
  exportString: encodeStandaloneBlueprintString(entityKind, payload),
  children: (payload.blueprints ?? []).map((entry) => {
    const { entityKind: childKind, payload: childPayload } =
      entityKindAndPayload(entry);
    return buildTreeNode(childKind, childPayload);
  }),
});

// Only the detail page needs this — the full recursive contents of a
// Blueprint Book (books can nest books arbitrarily deep). Kept separate
// from decodeBlueprintString so browse/seed don't pay for walking a tree
// they never render.
export const decodeBlueprintTree = (raw: string): BlueprintTreeNode => {
  const { entityKind, payload } = parseBlueprintPayload(raw);
  return buildTreeNode(entityKind, payload);
};
