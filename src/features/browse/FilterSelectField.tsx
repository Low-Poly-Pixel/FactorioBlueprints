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
        <SelectContent
          className="w-(--radix-select-trigger-width) min-w-0"
          position="popper"
        >
          {options.length > 0 ? (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1.5 text-muted-foreground text-sm">
              No {placeholder.toLowerCase()} options
            </div>
          )}
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

  return disabled && disabledTooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>{field}</TooltipTrigger>
      <TooltipContent>{disabledTooltip}</TooltipContent>
    </Tooltip>
  ) : (
    field
  );
};
