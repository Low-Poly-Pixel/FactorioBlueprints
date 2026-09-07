// Faint top inner-highlight plus a soft ambient shadow, applied to every
// bg-card surface (blueprint cards, detail-page panels, empty-state boxes)
// so they read as "a surface catching light" rather than a flat colored
// rectangle. Shared rather than repeated per container so every bg-card
// surface stays visually consistent as new ones are added.
export const surfaceDepthClassName =
  'shadow-[inset_0_1px_0_0_oklch(100%_0_0/8%),0_1px_3px_0_oklch(0%_0_0/35%)]';
