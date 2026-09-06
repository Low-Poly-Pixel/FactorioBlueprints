import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/components/shadcn/select';
import { interactiveFieldClassName } from './interactiveFieldClassName';

// Sentinel for "no selection" — Radix's Select.Item forbids an empty-string
// value, so this stands in for undefined and gets translated back at the
// call site.
const anyValue = 'any';

export type FilterSelectOption = {
  label: string;
  value: string;
};

type FilterSelectFieldProps = {
  anyLabel: string;
  ariaLabel: string;
  disabled?: boolean;
  onChange: (value: string | undefined) => void;
  options: FilterSelectOption[];
  placeholder: string;
  value: string | undefined;
  // Content width matches the trigger exactly (see SelectContent below), so
  // this needs to fit each field's own longest label — "Deconstruction
  // Planner" needs far more room than "Any patch" does.
  widthClassName: string;
};

export const FilterSelectField = ({
  anyLabel,
  ariaLabel,
  disabled,
  onChange,
  options,
  placeholder,
  value,
  widthClassName,
}: FilterSelectFieldProps) => (
  <Select
    disabled={disabled}
    onValueChange={(next) => onChange(next === anyValue ? undefined : next)}
    value={value ?? anyValue}
  >
    <SelectTrigger
      aria-label={ariaLabel}
      className={`${widthClassName} ${interactiveFieldClassName}`}
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
      <SelectItem value={anyValue}>{anyLabel}</SelectItem>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
