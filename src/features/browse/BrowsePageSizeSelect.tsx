import { useNavigate, useSearch } from '@tanstack/react-router';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select';
import { interactiveFieldClassName } from './interactiveFieldClassName';
import {
  DEFAULT_PAGE_SIZE,
  getPageSizeFromSearch,
  isPageSizeOption,
  PAGE_SIZE_OPTIONS,
} from './pagination';

type BrowsePageSizeSelectProps = {
  disabled?: boolean;
};

export const BrowsePageSizeSelect = ({
  disabled,
}: BrowsePageSizeSelectProps) => {
  const { pageSize } = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const value = getPageSizeFromSearch(pageSize);

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">Items Per page</span>
      <Select
        disabled={disabled}
        onValueChange={(next) => {
          const size = Number(next);
          if (!isPageSizeOption(size)) {
            return;
          }
          navigate({
            search: (previous) => ({
              ...previous,
              page: undefined,
              pageSize: size !== DEFAULT_PAGE_SIZE ? size : undefined,
            }),
            viewTransition: false,
          });
        }}
        value={String(value)}
      >
        <SelectTrigger
          aria-label="Results per page"
          className={`w-16 ${interactiveFieldClassName}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="w-(--radix-select-trigger-width) min-w-0"
          position="popper"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
