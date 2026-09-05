// The shared "card shell" wrapping a BlueprintSummaryCard — same rounded
// surface treatment and view-transition name whether it's a clickable
// browse-result link or the static detail-page hero, so the morph between
// the two (see BlueprintResultCard / BlueprintDetailPage) actually matches
// up on the same element.
export const blueprintCardShellClassName = 'rounded-md bg-card p-1';

export const getBlueprintCardViewTransitionName = (id: string): string =>
  `blueprint-card-${id}`;
