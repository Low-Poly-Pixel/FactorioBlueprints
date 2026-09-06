import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
};

// The scroll container itself (<main>) spans the full remaining width so
// its scrollbar sits flush against the actual window edge; the max-w-7xl
// centering happens one level in, on a plain div, so it constrains where
// the *content* sits without also shrinking the scrollbar's track.
//
// scrollbar-gutter-stable reserves the scrollbar's track width even while
// there's nothing to scroll, instead of only allocating it once content
// actually overflows. Without it, a classic (non-overlay) OS scrollbar
// toggling on/off — e.g. switching "items per page" from 8 to 2 — changes
// <main>'s available content width by the scrollbar's own width, so
// everything centered inside visibly shifts sideways. This has no effect
// on platforms with overlay scrollbars (macOS, mobile), which never
// consumed layout space to begin with.
export const PageContainer = ({ children }: PageContainerProps) => (
  <main className="scrollbar-gutter-stable flex-1 overflow-y-auto">
    <div className="mx-auto max-w-7xl px-8 py-6">{children}</div>
  </main>
);
