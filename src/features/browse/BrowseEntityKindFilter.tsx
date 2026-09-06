import { useNavigate, useSearch } from '@tanstack/react-router';
import type { EntityKind } from '../../shared/blueprint/entityKind';
import {
  fallbackTitles,
  isEntityKind,
} from '../../shared/blueprint/entityKind';
import { FilterSelectField } from './FilterSelectField';

// Object.entries() always widens keys to string, even though fallbackTitles
// is a Record<EntityKind, string> — a known TS stdlib typing gap, not
// unvalidated data (the object literal itself is ours and exhaustive), so
// this narrows back safely rather than trusting arbitrary input.
const entityKindOptions = (
  Object.entries(fallbackTitles) as [EntityKind, string][]
).map(([value, label]) => ({ label, value }));

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
          }),
        })
      }
      options={entityKindOptions}
      placeholder="Type"
      value={entityKind}
      widthClassName="w-48"
    />
  );
};
