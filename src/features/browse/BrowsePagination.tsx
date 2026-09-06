import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/components/shadcn/button';
import { getPaginationRange } from './pagination';

type BrowsePaginationProps = {
  currentPage: number;
  disabled?: boolean;
  totalPages: number;
};

export const BrowsePagination = ({
  currentPage,
  disabled,
  totalPages,
}: BrowsePaginationProps) => {
  const navigate = useNavigate({ from: '/' });

  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (page: number) =>
    navigate({
      search: (previous) => ({
        ...previous,
        page: page > 1 ? page : undefined,
      }),
      viewTransition: false,
    });

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <Button
        aria-label="Previous page"
        disabled={disabled || currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        size="icon-sm"
        variant="ghost"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </Button>
      {getPaginationRange(currentPage, totalPages).map((item) =>
        item === 'ellipsis-start' || item === 'ellipsis-end' ? (
          <span className="px-2 text-muted-foreground text-sm" key={item}>
            …
          </span>
        ) : (
          <Button
            aria-current={item === currentPage ? 'page' : undefined}
            disabled={disabled}
            key={item}
            onClick={() => goToPage(item)}
            size="icon-sm"
            variant={item === currentPage ? 'default' : 'ghost'}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        aria-label="Next page"
        disabled={disabled || currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        size="icon-sm"
        variant="ghost"
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </Button>
    </nav>
  );
};
