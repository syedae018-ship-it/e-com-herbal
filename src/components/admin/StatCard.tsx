import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant?: 'neutral' | 'success' | 'warning' | 'forest';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
}) => {
  const badgeColors = {
    neutral: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    forest: 'bg-forest-50 text-forest-800 border-forest-100',
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-zinc-300 transition-colors flex flex-col justify-between space-y-3">
      {/* Top row: Label & small icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 font-admin-body">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-zinc-600 shrink-0">
          <Icon className="w-4 h-4 stroke-[1.75]" />
        </div>
      </div>

      {/* Main KPI Value */}
      <div className="space-y-1">
        <div className="font-admin-heading text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">
          {value}
        </div>
        {subtitle && (
          <p className="text-[12px] text-zinc-500 font-admin-body leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      {/* Optional real badge if provided (no fake trends) */}
      {badge && (
        <div className="pt-1 border-t border-zinc-100">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
              badgeColors[badge.variant || 'neutral']
            }`}
          >
            {badge.text}
          </span>
        </div>
      )}
    </div>
  );
};
