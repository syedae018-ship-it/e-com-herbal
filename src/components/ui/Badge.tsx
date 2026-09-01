import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'forest' | 'sage' | 'amber' | 'charcoal' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'forest',
  size = 'sm',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    forest: 'bg-forest-100 text-forest-900',
    sage: 'bg-sage-100 text-forest-800',
    amber: 'bg-amber-100 text-amber-900 border border-amber-200/60',
    charcoal: 'bg-charcoal-100 text-charcoal-800',
    outline: 'border border-forest-900/20 text-forest-900',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
