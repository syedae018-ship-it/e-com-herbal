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
    <div className="bg-white rounded-2xl border border-sand-200 p-5 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sand-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-forest-800" />
          <h3 className="font-serif text-sm font-bold text-forest-950">Filter Products</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-forest-700 hover:text-forest-900 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Categories</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-sage-100 text-forest-900 font-semibold'
                : 'text-charcoal-700 hover:bg-sand-50'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === '' && <Check className="w-3.5 h-3.5 text-forest-800" />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-sage-100 text-forest-900 font-semibold'
                    : 'text-charcoal-700 hover:bg-sand-50'
                }`}
              >
                <span className="truncate text-left">{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-forest-800 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-3 pt-4 border-t border-sand-200">
        <div className="flex justify-between items-center text-xs">
          <h4 className="font-bold uppercase tracking-wider text-charcoal-700">Price Range</h4>
          <span className="text-forest-900 font-semibold">{formatINR(priceRange[1])} max</span>
        </div>
        <input
          type="range"
          min={200}
          max={1000}
          step={50}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
          className="w-full accent-forest-800 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-charcoal-500 font-medium">
          <span>{formatINR(200)}</span>
          <span>{formatINR(1000)}</span>
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3 pt-4 border-t border-sand-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Availability</h4>
        <label className="flex items-center gap-2 text-xs text-charcoal-800 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockToggle(e.target.checked)}
            className="w-4 h-4 rounded text-forest-800 focus:ring-forest-700 accent-forest-800 cursor-pointer"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
};
