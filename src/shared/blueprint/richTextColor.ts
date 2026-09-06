export type Rgb = {
  r: number;
  g: number;
  b: number;
};

// Factorio's own named-color set for [color=name] (wiki.factorio.com/Rich_text)
// mapped to the equivalent CSS Color Module keyword's defined RGB value —
// these names ARE standard CSS keywords except "acid" (Factorio-only, no
// published exact value — approximated here from its in-game acid/biter-spit
// effect color) and "default" (means "use the surrounding text color",
// handled separately below rather than in this table).
const namedColors: Record<string, Rgb> = {
  red: { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 128, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  orange: { r: 255, g: 165, b: 0 },
  yellow: { r: 255, g: 255, b: 0 },
  pink: { r: 255, g: 192, b: 203 },
  purple: { r: 128, g: 0, b: 128 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 },
  gray: { r: 128, g: 128, b: 128 },
  brown: { r: 165, g: 42, b: 42 },
  cyan: { r: 0, g: 255, b: 255 },
  acid: { r: 128, g: 210, b: 40 },
};

const clamp255 = (value: number): number => Math.min(255, Math.max(0, value));

const parseHex = (value: string): Rgb | null => {
  const hex = value.replace('#', '');
  // Factorio accepts #rrggbb and #aarrggbb — alpha is dropped here, this is
  // a solid text-color fill, not a translucent overlay.
  const rgbHex = hex.length === 8 ? hex.slice(2) : hex;
  if (!/^[0-9a-f]{6}$/i.test(rgbHex)) {
    return null;
  }

  return {
    r: Number.parseInt(rgbHex.slice(0, 2), 16),
    g: Number.parseInt(rgbHex.slice(2, 4), 16),
    b: Number.parseInt(rgbHex.slice(4, 6), 16),
  };
};

const parseNumberList = (value: string): Rgb | null => {
  const parts = value.split(',').map((part) => Number.parseFloat(part.trim()));
  if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  const [r, g, b] = parts;
  // Factorio accepts both 0-1 and 0-255 ranges for the same tag — anything
  // with every channel at most 1 is treated as the 0-1 form (0,0,0 reads
  // the same either way).
  const isUnitRange = r <= 1 && g <= 1 && b <= 1;

  return isUnitRange
    ? { r: clamp255(r * 255), g: clamp255(g * 255), b: clamp255(b * 255) }
    : { r: clamp255(r), g: clamp255(g), b: clamp255(b) };
};

// Returns null for "default" (use the surrounding text color) and for
// anything unrecognized, so callers fall back to not wrapping the text in a
// color at all rather than guessing at one.
export const parseRichTextColor = (rawValue: string): Rgb | null => {
  const value = rawValue.trim().toLowerCase();

  if (value === 'default') {
    return null;
  }
  if (value in namedColors) {
    return namedColors[value];
  }
  return value.startsWith('#') ? parseHex(value) : parseNumberList(value);
};

const srgbChannelToLinear = (channel255: number): number => {
  const channel = channel255 / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = ({ r, g, b }: Rgb): number =>
  0.2126 * srgbChannelToLinear(r) +
  0.7152 * srgbChannelToLinear(g) +
  0.0722 * srgbChannelToLinear(b);

const contrastRatio = (a: Rgb, b: Rgb): number => {
  const lighter = Math.max(relativeLuminance(a), relativeLuminance(b));
  const darker = Math.min(relativeLuminance(a), relativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
};

type Hsl = { h: number; s: number; l: number };

const rgbToHsl = ({ r, g, b }: Rgb): Hsl => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, l, s: 0 };
  }

  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const h =
    max === rNorm
      ? ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60
      : max === gNorm
        ? ((bNorm - rNorm) / delta + 2) * 60
        : ((rNorm - gNorm) / delta + 4) * 60;

  return { h, l, s };
};

const hueToChannel = (p: number, q: number, huePortion: number): number => {
  const wrapped = ((huePortion % 1) + 1) % 1;

  if (wrapped < 1 / 6) return p + (q - p) * 6 * wrapped;
  if (wrapped < 1 / 2) return q;
  if (wrapped < 2 / 3) return p + (q - p) * (2 / 3 - wrapped) * 6;
  return p;
};

const hslToRgb = ({ h, s, l }: Hsl): Rgb => {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hueNorm = h / 360;

  return {
    r: Math.round(hueToChannel(p, q, hueNorm + 1 / 3) * 255),
    g: Math.round(hueToChannel(p, q, hueNorm) * 255),
    b: Math.round(hueToChannel(p, q, hueNorm - 1 / 3) * 255),
  };
};

const WCAG_AA_NORMAL_TEXT_RATIO = 4.5;
const LIGHTNESS_SEARCH_STEPS = 20;

// Raises (never lowers) a color's HSL lightness — preserving its hue and
// saturation — until it reaches WCAG AA's 4.5:1 contrast ratio against
// `background`. ADR-0002 makes WCAG AA a hard requirement, so an
// author-picked color that's too dark against our card background gets
// brightened just enough to pass, rather than rendered as-is (risking a
// real accessibility failure) or discarded outright (losing their choice
// entirely). Binary search rather than a closed-form solve because
// luminance isn't linear in HSL lightness once saturation is involved.
export const ensureAccessibleTextColor = (color: Rgb, background: Rgb): Rgb => {
  if (contrastRatio(color, background) >= WCAG_AA_NORMAL_TEXT_RATIO) {
    return color;
  }

  const hsl = rgbToHsl(color);
  let low = hsl.l;
  let high = 1;

  for (let step = 0; step < LIGHTNESS_SEARCH_STEPS; step++) {
    const mid = (low + high) / 2;
    const candidate = hslToRgb({ ...hsl, l: mid });
    if (contrastRatio(candidate, background) >= WCAG_AA_NORMAL_TEXT_RATIO) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return hslToRgb({ ...hsl, l: high });
};

export const rgbToCssColor = ({ r, g, b }: Rgb): string =>
  `rgb(${r} ${g} ${b})`;
