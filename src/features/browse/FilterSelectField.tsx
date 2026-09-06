import { X } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/components/shadcn/select';
import { interactiveFieldClassName } from './interactiveFieldClassName';

export type FilterSelectOption = {
  label: string;
  value: string;
};

type FilterSelectFieldProps = {
  ariaLabel: string;
  disabled?: boolean;
  onChange: (value: string | undefined) => void;
  options: FilterSelectOption[];
  placeholder: string;
  value: string | undefined;
  // Content width matches the trigger exactly (see SelectContent below), so
  // this needs to fit each field's own longest label — "Deconstruction
  // Planner" needs far more room than a bare "Patch" placeholder does.
  widthClassName: string;
};

export const FilterSelectField = ({
  ariaLabel,
  disabled,
  onChange,
  options,
  placeholder,
  value,
  widthClassName,
}: FilterSelectFieldProps) => (
  <div className="relative">
    <Select
      disabled={disabled}
      onValueChange={(next) => onChange(next || undefined)}
      value={value ?? ''}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={`${widthClassName} ${value ? 'pr-7' : ''} ${interactiveFieldClassName}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      {/* Radix defaults to "item-aligned" positioning, which aligns each
          item's text to the trigger's displayed value instead of padding it
          normally — reads as centered-on-trigger with lopsided item padding.
          "popper" anchors a normally-laid-out menu directly under the
          trigger, matching its width via the CSS variable Radix exposes. */}
      <SelectContent
        className="w-[var(--radix-select-trigger-width)] min-w-0"
        position="popper"
      >
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {value && (
      <button
        aria-label={`Clear ${placeholder.toLowerCase()} filter`}
        className="-translate-y-1/2 absolute top-1/2 right-7 text-muted-foreground transition-colors hover:text-foreground"
        onClick={(event) => {
          event.stopPropagation();
          onChange(undefined);
        }}
        type="button"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    )}
  </div>
);
