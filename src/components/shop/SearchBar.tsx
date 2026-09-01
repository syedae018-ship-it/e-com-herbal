'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search pure herbal remedies, organic superfoods, face oils...',
}) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-sand-300 rounded-xl px-4 py-2.5 pl-11 pr-10 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-700 shadow-sm"
      />
      <Search className="w-4 h-4 text-charcoal-400 absolute left-4 top-3" />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-2.5 text-charcoal-400 hover:text-charcoal-800 p-0.5 rounded-full"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
