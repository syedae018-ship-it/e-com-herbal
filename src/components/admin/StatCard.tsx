import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-charcoal-500">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-forest-950 font-sans">{value}</h3>
        {subtitle && <p className="text-xs text-charcoal-500">{subtitle}</p>}
        {trend && (
          <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            {trend}
          </span>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-900 shrink-0">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
