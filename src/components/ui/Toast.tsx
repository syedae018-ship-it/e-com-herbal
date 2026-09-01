'use client';

import React from 'react';
import { useCart } from '@/lib/../context/CartContext';
import { CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

export const Toast: React.FC = () => {
  const { toastMessage, setToastMessage, setIsCartOpen } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full bg-forest-900 text-cream-50 p-4 rounded-xl shadow-elevated border border-forest-700/50 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-sage-300 shrink-0" />
        <div>
          <p className="text-sm font-medium">{toastMessage}</p>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-xs text-sage-300 hover:text-white underline font-semibold mt-0.5 inline-block"
          >
            View Cart
          </button>
        </div>
      </div>
      <button
        onClick={() => setToastMessage(null)}
        className="text-forest-300 hover:text-white p-1 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
