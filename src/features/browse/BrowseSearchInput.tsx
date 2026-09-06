import { useNavigate, useSearch } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Input } from '@/shared/components/shadcn/input';
import { interactiveFieldClassName } from './interactiveFieldClassName';
import { useDebouncedValue } from './useDebouncedValue';

const searchDebounceMs = 300;

export const BrowseSearchInput = () => {
  const { q } = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const [inputValue, setInputValue] = useState(q ?? '');
  const debouncedValue = useDebouncedValue(inputValue, searchDebounceMs);
  const lastAppliedValue = useRef(debouncedValue);

  useEffect(() => {
    // Guards against two things, not just one: (1) the run that fires on
    // mount, where debouncedValue already equals the URL's own q (no delay
    // on the initial value), and (2) the effect re-firing on a render where
    // debouncedValue hasn't actually changed but `navigate` has a new
    // function identity (useNavigate isn't referentially stable). Either
    // case would otherwise strip page from the URL via the replace below —
    // e.g. undoing whatever page the user was on when navigating back from
    // a detail page. Comparing against the last value actually acted on
    // (rather than a one-shot "is this mount" flag) handles both.
    if (debouncedValue === lastAppliedValue.current) {
      return;
    }
    lastAppliedValue.current = debouncedValue;

    navigate({
      replace: true,
      search: (previous) => ({
        ...previous,
        page: undefined,
        q: debouncedValue || undefined,
      }),
      viewTransition: false,
    });
  }, [debouncedValue, navigate]);

  return (
    <div className="relative flex-1">
      <Input
        aria-label="Search blueprints by title"
        className={`peer pl-9 ${interactiveFieldClassName}`}
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
