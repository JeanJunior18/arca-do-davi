import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export function Select({ label, options, error, id, name, className = '', ...rest }: SelectProps) {
  const fieldId = id ?? name;

  return (
    <label className="flex w-full flex-col gap-1.5" htmlFor={fieldId}>
      <span className="flex min-h-9 items-end font-body text-xs font-semibold uppercase tracking-wide text-primary-700">
        {label}
      </span>
      <select
        id={fieldId}
        name={name}
        className={`w-full rounded-xl border bg-surface px-4 py-3 font-body text-ink focus:outline-none focus:ring-2 focus:ring-primary-400 ${
          error ? 'border-secondary-500' : 'border-primary-200 focus:border-primary-400'
        } ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="font-body text-xs text-secondary-700">{error}</span>}
    </label>
  );
}
