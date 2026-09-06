import type { ReactNode } from 'react';

import { CollapsibleContent } from '@/shared/components/shadcn/collapsible';

type BlueprintTreeNodeCollapsibleContentProps = {
  isRoot: boolean;
  isExpanded: boolean;
  children: ReactNode;
};

// The root starts expanded on mount (see useBlueprintTreeNavigation). Radix's
// CollapsibleContent always runs an internal effect that temporarily zeroes
// out transition-duration/animation-name to measure natural content size,
// only restoring them once an "isMountAnimationPrevented" ref unlocks on the
// next animation frame after mount — and that ref starts (and stays) locked
// whenever content is already "open" at mount, which is exactly root's case,
// regardless of forceMount. Slow dev-mode hydration makes that window easy
// to click into, so the root's first collapse/reopen would silently snap
// instead of animating. Skipping CollapsibleContent for root and driving a
// plain div's height via our own data-state + CSS grid-rows transition
// sidesteps that Radix internal entirely. Nested branches always start
// closed and aren't affected, so they keep the lazier, Radix-managed
// animation (and its lazy mount-on-expand).
export const BlueprintTreeNodeCollapsibleContent = ({
  isRoot,
  isExpanded,
  children,
}: BlueprintTreeNodeCollapsibleContentProps) =>
  isRoot ? (
    <div
      aria-hidden={!isExpanded}
      className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out data-[state=open]:grid-rows-[1fr]"
      data-state={isExpanded ? 'open' : 'closed'}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  ) : (
    <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
      {children}
    </CollapsibleContent>
  );
