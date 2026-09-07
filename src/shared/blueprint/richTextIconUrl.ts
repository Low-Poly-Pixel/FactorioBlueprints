import {
  CDN_BASE,
  PRIMARY_CDN_BASE,
  resolveVirtualSignalCdnName,
  toWikiName,
  toWikiSignalName,
} from './icons.ts';

// The rich-text icon tag names (wiki.factorio.com/Rich_text) that reference
// a real game icon, as opposed to color/font/tooltip which wrap text.
export type RichTextIconTagName =
  | 'item'
  | 'entity'
  | 'fluid'
  | 'recipe'
  | 'technology'
  | 'tile'
  | 'virtual-signal'
  | 'planet'
  | 'space-location';

// The primary CDN (see icons.ts) has no separate 'planet' folder —
// confirmed against its actual routes — planets live under
// 'space-location' there, so both rich-text tags resolve to the same
// category on that CDN specifically. Every other tag name already matches
// its own folder there 1:1.
const primaryCdnCategoryByTagName: Record<RichTextIconTagName, string> = {
  item: 'item',
  entity: 'entity',
  fluid: 'fluid',
  recipe: 'recipe',
  technology: 'technology',
  tile: 'tile',
  'virtual-signal': 'virtual-signal',
  planet: 'space-location',
  'space-location': 'space-location',
};

// Unlike a blueprint's own declared icons (icons.ts), these come from
// freeform title/description text an author typed — any item/entity/etc.
// name in the game, not a small verified set. Checking each one's
// existence via a HEAD request at seed/upload time (icons.ts's usual
// pattern) would mean resolving an unbounded, arbitrary set of names per
// blueprint; instead these render client-side with a plain <img onError>
// cascade through candidates, same CDN-then-wiki fallback order as icons.ts.
export const getRichTextIconCandidateUrls = (
  tagName: RichTextIconTagName,
  itemName: string,
): string[] => {
  const isVirtualSignal = tagName === 'virtual-signal';
  const path = isVirtualSignal
    ? `signal/${resolveVirtualSignalCdnName(itemName)}`
    : itemName;
  const wikiName = isVirtualSignal
    ? toWikiSignalName(itemName)
    : toWikiName(itemName);

  return [
    `${PRIMARY_CDN_BASE}/${primaryCdnCategoryByTagName[tagName]}/${itemName}.webp`,
    `${CDN_BASE}/base/icons/${path}.png`,
    `${CDN_BASE}/space-age/icons/${path}.png`,
    `https://wiki.factorio.com/images/${wikiName}.png`,
  ];
};
