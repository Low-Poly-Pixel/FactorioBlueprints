import type {
  BlueprintIcon,
  BlueprintTreeNode,
  EntityKind,
} from './exportStringDecoder.ts';

export type ResolvedBlueprintIcon = {
  name: string;
  url: string;
  index: number;
};

export type ResolvedBlueprintTreeNode = {
  entityKind: EntityKind;
  title: string;
  icons: ResolvedBlueprintIcon[];
  children: ResolvedBlueprintTreeNode[];
  exportString: string;
};

export const CDN_BASE =
  'https://cdn.jsdelivr.net/gh/deniszholob/icons-factorio@main/factorio-icons';

// The tool item's own icon, always in the base-game set (blueprint/book/
// planner items have existed since before Space Age) — used as the base
// image the player-chosen icons sit on top of, matching Factorio's own UI.
export const entityKindIconUrls: Record<EntityKind, string> = {
  blueprint: `${CDN_BASE}/base/icons/blueprint.png`,
  blueprint_book: `${CDN_BASE}/base/icons/blueprint-book.png`,
  upgrade_planner: `${CDN_BASE}/base/icons/upgrade-planner.png`,
  deconstruction_planner: `${CDN_BASE}/base/icons/deconstruction-planner.png`,
};

// MediaWiki sentence case: only the first word is capitalized, the rest
// stay lowercase, joined by underscores (e.g. "assembling-machine-1" ->
// "Assembling_machine_1").
export const toWikiName = (name: string): string =>
  name
    .split('-')
    .map((word, index) =>
      index === 0 ? `${word[0].toUpperCase()}${word.slice(1)}` : word,
    )
    .join('_');

// Virtual signal images use a different wiki convention than regular
// items — the hyphen between "signal" and its letter/word is kept, not
// converted to an underscore, and later segments keep their original
// casing rather than being lowercased (confirmed against the wiki's own
// image URL: "signal-V" -> "Signal-V.png", not "Signal_v.png").
export const toWikiSignalName = (name: string): string =>
  name
    .split('-')
    .map((word, index) =>
      index === 0 ? `${word[0].toUpperCase()}${word.slice(1)}` : word,
    )
    .join('-');

const cdnIconPath = (icon: BlueprintIcon): string =>
  icon.type === 'virtual' ? `signal/${icon.name}` : icon.name;

// The wiki's MediaWiki thumbnail path (/images/thumb/<name>.png/<px>-<name>.png)
// only resolves for pixel sizes that have actually been pre-generated —
// requesting an arbitrary size like 64px 404s for most images, since
// nothing has requested that exact size before. The original upload at
// /images/<name>.png has no such dependency and is always present when the
// wiki has the image at all, confirmed directly against a real page's
// rendered <img> URLs.
export const getWikiImageUrl = (icon: BlueprintIcon): string =>
  `https://wiki.factorio.com/images/${icon.type === 'virtual' ? toWikiSignalName(icon.name) : toWikiName(icon.name)}.png`;

// Ordered fallback chain: the community CDN's base-game set, then its
// Space Age set (some signals, like the non-Nauvis planets, only exist
// there), then the wiki as a last resort per ADR-0001.
export const getIconCandidateUrls = (icon: BlueprintIcon): string[] => {
  const path = cdnIconPath(icon);

  return [
    `${CDN_BASE}/base/icons/${path}.png`,
    `${CDN_BASE}/space-age/icons/${path}.png`,
    getWikiImageUrl(icon),
  ];
};

const urlExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return response.ok;
  } catch {
    return false;
  }
};

// Checks each candidate in order and returns the first that actually
// resolves. Meant to run once at ingest/seed time (blueprints are
// immutable per ADR-0004) rather than per-request or client-side —
// resolving in the browser via <img onError> races page hydration and
// is unreliable.
export const resolveIconUrl = async (
  icon: BlueprintIcon,
): Promise<ResolvedBlueprintIcon | null> => {
  for (const url of getIconCandidateUrls(icon)) {
    if (await urlExists(url)) {
      return { name: icon.name, url, index: icon.index };
    }
  }

  return null;
};

// Recursively resolves every icon at every depth of a blueprint book's
// contents tree. Same immutable/ingest-time reasoning as resolveIconUrl —
// this walks the whole tree once at seed/upload time, not per detail-page
// request, so a large book's icon count doesn't cost a page load.
//
// A book with no icons of its own falls back to its first child's icons —
// matching Factorio's own default-icon behavior in-game for an icon-less
// book. Children resolve before their parent here, so a chain of icon-less
// books already carries whichever real icon its first-of-first-of-first
// child eventually has, with no extra recursion needed.
export const resolveTreeIcons = async (
  node: BlueprintTreeNode,
): Promise<ResolvedBlueprintTreeNode> => {
  const [icons, children] = await Promise.all([
    Promise.all(node.icons.map((icon) => resolveIconUrl(icon))),
    Promise.all(node.children.map((child) => resolveTreeIcons(child))),
  ]);

  const resolvedIcons = icons.filter((icon) => icon !== null);

  return {
    entityKind: node.entityKind,
    title: node.title,
    icons:
      resolvedIcons.length > 0 ? resolvedIcons : (children[0]?.icons ?? []),
    children,
    exportString: node.exportString,
  };
};
