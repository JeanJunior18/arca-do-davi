import type { HTMLAttributes } from 'react';

type BadgeVariant = 'solid' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  solid: 'bg-primary-600 text-accent-foreground',
  outline: 'border border-primary-300 bg-primary-50 text-primary-700',
};

export function Badge({ variant = 'solid', className = '', children, ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wider ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
