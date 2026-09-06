import { useNavigate, useSearch } from '@tanstack/react-router';
import type { EntityKind } from '@/shared/blueprint/entityKind';
import { fallbackTitles, isEntityKind } from '@/shared/blueprint/entityKind';
import { FilterSelectField } from './FilterSelectField';

// Object.entries() always widens keys to string, even though fallbackTitles
// is a Record<EntityKind, string> — a known TS stdlib typing gap. Narrowed
// with the same isEntityKind guard used on the URL-read side, rather than
// asserting the gap away.
const entityKindOptions = Object.entries(fallbackTitles)
  .filter((entry): entry is [EntityKind, string] => isEntityKind(entry[0]))
  .map(([value, label]) => ({ label, value }));

export const BrowseEntityKindFilter = () => {
  const { entityKind } = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });

  return (
    <FilterSelectField
      ariaLabel="Filter by blueprint type"
      onChange={(value) =>
        navigate({
          search: (previous) => ({
            ...previous,
            entityKind: value && isEntityKind(value) ? value : undefined,
            page: undefined,
          }),
          viewTransition: false,
        })
      }
      options={entityKindOptions}
      placeholder="Type"
      value={entityKind}
      widthClassName="w-48"
    />
  );
};
