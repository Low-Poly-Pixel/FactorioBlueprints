import { CDN_BASE, toWikiName, toWikiSignalName } from './icons.ts';

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
  const path = isVirtualSignal ? `signal/${itemName}` : itemName;
  const wikiName = isVirtualSignal
    ? toWikiSignalName(itemName)
    : toWikiName(itemName);

  return [
    `${CDN_BASE}/base/icons/${path}.png`,
    `${CDN_BASE}/space-age/icons/${path}.png`,
    `https://wiki.factorio.com/images/${wikiName}.png`,
  ];
};
