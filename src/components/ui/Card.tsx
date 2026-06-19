import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Acrescenta a faixa decorativa em arco-íris pastel no topo do card. */
  whimsyAccent?: boolean;
}

export function Card({ whimsyAccent = false, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-primary-100/60 bg-surface p-6 shadow-card ${className}`}
      {...rest}
    >
      {whimsyAccent && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,var(--color-whimsy-pink),var(--color-whimsy-yellow),var(--color-whimsy-sky),var(--color-whimsy-mint))]"
        />
      )}
      {children}
    </div>
  );
}
