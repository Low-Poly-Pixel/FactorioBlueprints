export const PAGE_SIZE_OPTIONS = [2, 4, 8] as const;

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export const DEFAULT_PAGE_SIZE: PageSize = 8;

// Guards against both a value outside {2, 4, 8} AND a wrong runtime type
export const isPageSizeOption = (value: unknown): value is PageSize =>
  (PAGE_SIZE_OPTIONS as readonly unknown[]).includes(value);

export const getPageSizeFromSearch = (
  pageSize: number | undefined,
): PageSize =>
  pageSize !== undefined && isPageSizeOption(pageSize)
    ? pageSize
    : DEFAULT_PAGE_SIZE;

export type ResolvedPagination = {
  offset: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Turns "what was asked for" (a page/pageSize that can be anything — a
// hand-edited URL, or a direct call to the searchBlueprints server function
// bypassing the route entirely) into "what's actually valid" against the
// real result count: pageSize falls back to the default unless it's one of
// PAGE_SIZE_OPTIONS, page falls back to 1 unless it's a positive integer,
// and either is then clamped to the real last page.
export const resolvePagination = (input: {
  page: number;
  pageSize: number;
  totalCount: number;
}): ResolvedPagination => {
  const pageSize = getPageSizeFromSearch(input.pageSize);
  const requestedPage =
    Number.isInteger(input.page) && input.page > 0 ? input.page : 1;
  const totalPages = Math.max(1, Math.ceil(input.totalCount / pageSize));
  const page = Math.min(requestedPage, totalPages);

  return { offset: (page - 1) * pageSize, page, pageSize, totalPages };
};

export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] => {
  const totalNumbersShown = siblingCount * 2 + 5;

  if (totalPages <= totalNumbersShown) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = siblingCount * 2 + 3;
    return [...range(1, leftItemCount), 'ellipsis-end', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = siblingCount * 2 + 3;
    return [
      1,
      'ellipsis-start',
      ...range(totalPages - rightItemCount + 1, totalPages),
    ];
  }

  return [
    1,
    'ellipsis-start',
    ...range(leftSibling, rightSibling),
    'ellipsis-end',
    totalPages,
  ];
};
