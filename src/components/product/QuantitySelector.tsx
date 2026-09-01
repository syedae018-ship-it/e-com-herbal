import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  max = 99,
}) => {
  return (
    <div className="inline-flex items-center border-2 border-sand-300 rounded-xl bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-700 hover:text-forest-900 hover:bg-sand-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-12 text-center text-sm font-bold text-forest-950 font-sans">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-700 hover:text-forest-900 hover:bg-sand-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
