import {
  ensureAccessibleTextColor,
  parseRichTextColor,
  rgbToCssColor,
} from './richTextColor.ts';
import {
  getRichTextIconCandidateUrls,
  type RichTextIconTagName,
} from './richTextIconUrl.ts';

export type FactorioRichTextSegment =
  | { type: 'text'; text: string }
  | {
      type: 'icon';
      tagName: RichTextIconTagName;
      name: string;
      candidateUrls: string[];
    }
  | { type: 'color'; color: string; segments: FactorioRichTextSegment[] };

const iconTagNames: readonly RichTextIconTagName[] = [
  'item',
  'entity',
  'fluid',
  'recipe',
  'technology',
  'tile',
  'virtual-signal',
  'planet',
  'space-location',
];

// Wrapping tags whose content we render but don't apply — Factorio's
// in-game bitmap fonts (font=) and hover tooltips (tooltip=) have no web
// equivalent here, so their content passes through plain rather than being
// dropped.
const passthroughTagNames = ['font', 'tooltip'];

const iconTagPattern = `(?:${iconTagNames.join('|')})=[^[\\]]*`;
const passthroughTagPattern = `(?:${passthroughTagNames.join('|')})=[^[\\]]*`;

const tokenPattern = new RegExp(
  `(\\[${iconTagPattern}\\]|\\[color=[^[\\]]*\\]|\\[${passthroughTagPattern}\\]|\\[[/.](?:color|${passthroughTagNames.join('|')})\\])`,
  'gi',
);
const iconTokenPattern = new RegExp(
  `^\\[(${iconTagNames.join('|')})=([^[\\]]*)\\]$`,
  'i',
);
const colorOpenTokenPattern = /^\[color=([^[\]]*)\]$/i;
const passthroughOpenTokenPattern = new RegExp(
  `^\\[(?:${passthroughTagNames.join('|')})=[^[\\]]*\\]$`,
  'i',
);
const closeTokenPattern = /^\[[/.](?:color|font|tooltip)\]$/i;

// Resolved --card (see styles.css) — the surface titles and descriptions
// both render on, and what author-picked colors get contrast-checked
// against.
const cardBackground = { b: 23, g: 23, r: 23 };

type Frame = {
  kind: 'root' | 'color' | 'passthrough';
  color: string | null;
  segments: FactorioRichTextSegment[];
};

const flushFrame = (frame: Frame, parent: Frame): void => {
  if (frame.kind === 'color' && frame.color) {
    parent.segments.push({
      color: frame.color,
      segments: frame.segments,
      type: 'color',
    });
    return;
  }
  parent.segments.push(...frame.segments);
};

const closeFrame = (stack: Frame[]): void => {
  if (stack.length <= 1) {
    return;
  }
  const closedFrame = stack.pop();
  if (closedFrame) {
    flushFrame(closedFrame, stack[stack.length - 1]);
  }
};

const resolveOpenColor = (rawValue: string): string | null => {
  const parsedColor = parseRichTextColor(rawValue);
  return parsedColor
    ? rgbToCssColor(ensureAccessibleTextColor(parsedColor, cardBackground))
    : null;
};

// Applies one token — a matched tag, or a run of plain text between tags —
// to the in-progress parse. Pulled out of parseFactorioRichText to keep
// that function's own branching (just a loop and a drain-loop) simple.
const processToken = (token: string, stack: Frame[]): void => {
  const iconMatch = iconTokenPattern.exec(token);
  if (iconMatch) {
    const tagName = iconMatch[1].toLowerCase() as RichTextIconTagName;
    const name = iconMatch[2];
    stack[stack.length - 1].segments.push({
      candidateUrls: getRichTextIconCandidateUrls(tagName, name),
      name,
      tagName,
      type: 'icon',
    });
    return;
  }

  const colorOpenMatch = colorOpenTokenPattern.exec(token);
  if (colorOpenMatch) {
    stack.push({
      color: resolveOpenColor(colorOpenMatch[1]),
      kind: 'color',
      segments: [],
    });
    return;
  }

  if (closeTokenPattern.test(token)) {
    closeFrame(stack);
    return;
  }

  if (passthroughOpenTokenPattern.test(token)) {
    stack.push({ color: null, kind: 'passthrough', segments: [] });
    return;
  }

  // Anything else — including literal bracket text like "[WIP]" that
  // doesn't match one of the exact tag patterns above — is plain text.
  stack[stack.length - 1].segments.push({ text: token, type: 'text' });
};

// Parses Factorio's rich-text markup (wiki.factorio.com/Rich_text) — used
// in both a blueprint's title and its description — into a tree of
// text/icon/color segments for rendering, see FactorioRichText.tsx.
// Stack-based rather than a strict nested-tag grammar so malformed input
// (an unclosed [color=...], a stray [/color] with nothing open) degrades
// gracefully instead of throwing, since this text comes from whatever an
// uploader typed, not a validated source.
export const parseFactorioRichText = (
  text: string,
): FactorioRichTextSegment[] => {
  const tokens = text.split(tokenPattern).filter((token) => token !== '');
  const root: Frame = { color: null, kind: 'root', segments: [] };
  const stack: Frame[] = [root];

  for (const token of tokens) {
    processToken(token, stack);
  }
  while (stack.length > 1) {
    closeFrame(stack);
  }

  return root.segments;
};
