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
    <div className="relative w-full font-admin-body">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-zinc-200/90 rounded-lg px-3.5 py-2 pl-9 pr-8 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors"
      />
      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 sm:top-3" />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-2 sm:top-2.5 text-zinc-400 hover:text-zinc-700 p-0.5 rounded-full"
          aria-label="Clear search query"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
