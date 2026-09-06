import { useNavigate, useSearch } from '@tanstack/react-router';
import type { EntityKind } from '../../shared/blueprint/entityKind';
import { fallbackTitles } from '../../shared/blueprint/entityKind';
import { FilterSelectField } from './FilterSelectField';

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
            entityKind: value as EntityKind | undefined,
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
