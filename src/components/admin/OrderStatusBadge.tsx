import React from 'react';
import { OrderStatus } from '@/lib/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config: Record<
    OrderStatus,
    { dotBg: string; badgeBg: string; border: string; text: string; label: string }
  > = {
    pending: {
      dotBg: 'bg-amber-500',
      badgeBg: 'bg-amber-50/80',
      border: 'border-amber-200/80',
      text: 'text-amber-800',
      label: 'Pending',
    },
    confirmed: {
      dotBg: 'bg-sky-500',
      badgeBg: 'bg-sky-50/80',
      border: 'border-sky-200/80',
      text: 'text-sky-800',
      label: 'Confirmed',
    },
    processing: {
      dotBg: 'bg-indigo-500',
      badgeBg: 'bg-indigo-50/80',
      border: 'border-indigo-200/80',
      text: 'text-indigo-800',
      label: 'Processing',
    },
    shipped: {
      dotBg: 'bg-purple-500',
      badgeBg: 'bg-purple-50/80',
      border: 'border-purple-200/80',
      text: 'text-purple-800',
      label: 'Shipped',
    },
    delivered: {
      dotBg: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50/80',
      border: 'border-emerald-200/80',
      text: 'text-emerald-800',
      label: 'Delivered',
    },
    cancelled: {
      dotBg: 'bg-zinc-400',
      badgeBg: 'bg-zinc-100',
      border: 'border-zinc-200',
      text: 'text-zinc-600',
      label: 'Cancelled',
    },
  };

  const current = config[status] || config.pending;
  const sizeClasses = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-admin-body font-medium border ${current.badgeBg} ${current.border} ${current.text} ${sizeClasses} tracking-tight select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dotBg} shrink-0`} />
      <span>{current.label}</span>
    </span>
  );
};
