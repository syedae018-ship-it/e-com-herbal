'use client';

import React from 'react';
import { Category } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { Filter, RotateCcw, Check } from 'lucide-react';

interface FilterPanelProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  inStockOnly: boolean;
  onStockToggle: (val: boolean) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  inStockOnly,
  onStockToggle,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-xl border border-zinc-200/80 p-4 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] font-admin-body text-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-forest-800" />
          <h3 className="font-admin-heading text-xs sm:text-sm font-semibold text-zinc-950">
            Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] text-zinc-400 hover:text-forest-900 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
          Collections ({categories.length})
        </span>
        <div className="space-y-0.5">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
              selectedCategory === ''
                ? 'bg-forest-900/8 text-forest-950 font-semibold border-l-2 border-forest-900 rounded-l-none pl-2'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-normal'
            }`}
          >
            <span>All Products</span>
            {selectedCategory === '' && <Check className="w-3 h-3 text-forest-800 shrink-0" />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-forest-900/8 text-forest-950 font-semibold border-l-2 border-forest-900 rounded-l-none pl-2'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-normal'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="w-3 h-3 text-forest-800 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter Slider */}
      <div className="space-y-2.5 pt-3 border-t border-zinc-100">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Price Range
          </span>
          <span className="font-admin-heading text-xs font-semibold text-zinc-900 tabular-nums">
            Up to {formatINR(priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min={200}
          max={1000}
          step={50}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-forest-800 cursor-pointer h-1.5 bg-zinc-100 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 font-medium tabular-nums">
          <span>{formatINR(200)}</span>
          <span>{formatINR(1000)}</span>
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-3 border-t border-zinc-100">
        <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer select-none py-0.5">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockToggle(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-forest-800 focus:ring-forest-700 accent-forest-800 cursor-pointer"
          />
          <span className="font-medium">In Stock Only</span>
        </label>
      </div>
    </div>
  );
};
