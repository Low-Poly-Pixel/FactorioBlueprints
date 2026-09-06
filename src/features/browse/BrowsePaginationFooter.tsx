import { BrowsePageSizeSelect } from './BrowsePageSizeSelect';
import { BrowsePagination } from './BrowsePagination';

type BrowsePaginationFooterProps = {
  currentPage: number;
  disabled: boolean;
  totalPages: number;
};

// A full-width bar, sibling of PageContainer rather than nested inside it —
// nesting it in PageContainer's max-w-7xl column would cap its background
// at that width instead of spanning the viewport like the header/sub-header
// above it, and it sitting outside the scrollable <main> (see __root.tsx)
// is what keeps it visible instead of scrolling away with the results.
export const BrowsePaginationFooter = ({
  currentPage,
  disabled,
  totalPages,
}: BrowsePaginationFooterProps) => (
  <div className="border-border border-t bg-card/70">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3">
      <BrowsePageSizeSelect disabled={disabled} />
      <BrowsePagination
        currentPage={currentPage}
        disabled={disabled}
        totalPages={totalPages}
      />
    </div>
  </div>
);
