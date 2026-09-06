import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/components/shadcn/select';

// Sentinel for "no selection" — Radix's Select.Item forbids an empty-string
// value, so this stands in for undefined and gets translated back at the
// call site.
const anyValue = 'any';

type VersionSelectFieldProps = {
  anyLabel: string;
  ariaLabel: string;
  disabled?: boolean;
  onChange: (value: number | undefined) => void;
  options: number[];
  placeholder: string;
  value: number | undefined;
};

export const VersionSelectField = ({
  anyLabel,
  ariaLabel,
  disabled,
  onChange,
  options,
  placeholder,
  value,
}: VersionSelectFieldProps) => (
  <Select
    disabled={disabled}
    onValueChange={(next) =>
      onChange(next === anyValue ? undefined : Number(next))
    }
    value={value === undefined ? anyValue : String(value)}
  >
    <SelectTrigger aria-label={ariaLabel} className="w-28">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={anyValue}>{anyLabel}</SelectItem>
      {options.map((option) => (
        <SelectItem key={option} value={String(option)}>
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
