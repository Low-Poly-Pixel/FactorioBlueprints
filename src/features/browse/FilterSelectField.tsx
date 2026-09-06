import { X } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/components/shadcn/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../shared/components/shadcn/tooltip';
import { interactiveFieldClassName } from './interactiveFieldClassName';

export type FilterSelectOption = {
  label: string;
  value: string;
};

type FilterSelectFieldProps = {
  ariaLabel: string;
  disabled?: boolean;
  disabledTooltip?: string;
  onChange: (value: string | undefined) => void;
  options: FilterSelectOption[];
  placeholder: string;
  value?: string;
  widthClassName: string;
};

export const FilterSelectField = ({
  ariaLabel,
  disabled,
  disabledTooltip,
  onChange,
  options,
  placeholder,
  value,
  widthClassName,
}: FilterSelectFieldProps) => {
  const field = (
    <div className="relative">
      <Select
        disabled={disabled}
        onValueChange={(next) => onChange(next || undefined)}
        value={value ?? ''}
      >
        <SelectTrigger
          aria-label={ariaLabel}
          className={`${widthClassName} ${interactiveFieldClassName}`}
          hideChevron={Boolean(value)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {/* Radix defaults to "item-aligned" positioning, which aligns each
            item's text to the trigger's displayed value instead of padding
            it normally — reads as centered-on-trigger with lopsided item
            padding. "popper" anchors a normally-laid-out menu directly
            under the trigger, matching its width via the CSS variable
            Radix exposes. */}
        <SelectContent
          className="w-(--radix-select-trigger-width) min-w-0"
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
          className="-translate-y-1/2 absolute top-1/2 right-2 text-muted-foreground transition-colors hover:text-foreground"
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

  if (!(disabled && disabledTooltip)) {
    return field;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{field}</TooltipTrigger>
      <TooltipContent>{disabledTooltip}</TooltipContent>
    </Tooltip>
  );
};
