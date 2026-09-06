import { useNavigate, useSearch } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '../../shared/components/shadcn/input';
import { useDebouncedValue } from './useDebouncedValue';

const searchDebounceMs = 300;

export const BrowseSearchInput = () => {
  const { q } = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const [inputValue, setInputValue] = useState(q ?? '');
  const debouncedValue = useDebouncedValue(inputValue, searchDebounceMs);

  useEffect(() => {
    navigate({
      replace: true,
      search: (previous) => ({ ...previous, q: debouncedValue || undefined }),
    });
  }, [debouncedValue, navigate]);

  return (
    <div className="relative">
      <Input
        aria-label="Search blueprints by title"
        className="peer pl-9 transition-colors duration-200 hover:border-[oklch(0.85_0_0)] focus-visible:border-primary focus-visible:ring-0"
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search blueprints..."
        type="search"
        value={inputValue}
      />
      <Search
        aria-hidden="true"
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground transition-colors duration-200 peer-hover:text-[oklch(0.85_0_0)] peer-focus-visible:text-primary"
      />
    </div>
  );
};
