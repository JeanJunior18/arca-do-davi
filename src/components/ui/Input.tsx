import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, name, className = '', ...rest }: InputProps) {
  const fieldId = id ?? name;

  return (
    <label className="flex w-full flex-col gap-1.5" htmlFor={fieldId}>
      <span className="flex min-h-9 items-end font-body text-xs font-semibold uppercase tracking-wide text-primary-700">
        {label}
      </span>
      <input
        id={fieldId}
        name={name}
        className={`w-full rounded-xl border bg-surface px-4 py-3 font-body text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-primary-400 ${
          error ? 'border-secondary-500' : 'border-primary-200 focus:border-primary-400'
        } ${className}`}
        {...rest}
      />
      {error && <span className="font-body text-xs text-secondary-700">{error}</span>}
    </label>
  );
}
