'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, Leaf, HelpCircle, Truck } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductAccordionsProps {
  product: Product;
}

export const ProductAccordions: React.FC<ProductAccordionsProps> = ({ product }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    benefits: true,
    ingredients: false,
    howToUse: false,
    shipping: false,
  });

  const toggle = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const benefitsList = product.benefits
    ? product.benefits.split(';').map((b) => b.trim()).filter(Boolean)
    : [
        '100% Certified Organic & Chemical-free formulation',
        'Bioavailable whole herb extracts for optimal potency',
        'Nourishes and revitalizes without harsh synthetic chemicals',
        'Tested for purity, zero heavy metals, and cruelty-free',
      ];

  const sections = [
    {
      id: 'benefits',
      title: 'Product Benefits & Highlights',
      icon: Sparkles,
      content: (
        <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal-700">
          {benefitsList.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-700 mt-2 shrink-0" />
              <span className="leading-relaxed">{benefit}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'ingredients',
      title: 'Key Ingredients & Purity',
      icon: Leaf,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
          <p className="font-semibold text-forest-950">Full Formulation Transparency:</p>
          <p>{product.ingredients || '100% Pure Botanical Extracts, Cold-Pressed Organic Oils, Zero Preservatives.'}</p>
          <div className="pt-2 text-[11px] text-sage-700 bg-sage-50 p-3 rounded-xl border border-sage-200">
            🌱 <strong>Our Promise:</strong> Free from Parabens, SLS/SLES, Silicones, Phthalates, Artificial Fragrance, and Heavy Metals.
          </div>
        </div>
      ),
    },
    {
      id: 'howToUse',
      title: 'How to Use & Dosage',
      icon: HelpCircle,
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
          <p>{product.how_to_use || 'Take as recommended on label or consult your Ayurvedic wellness consultant.'}</p>
          <p className="text-[11px] text-charcoal-500 italic">
            *Store in a cool, dry place away from direct sunlight. Keep container tightly closed.
          </p>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery Info',
      icon: Truck,
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
          <p>
            • <strong>Fast Dispatch:</strong> Orders placed before 2 PM are dispatched on the same business day.
          </p>
          <p>
            • <strong>Delivery Timeline:</strong> 2–4 business days for metro cities, 3–6 business days for all other pin codes.
          </p>
          <p>
            • <strong>Free Delivery:</strong> Enjoy 100% free delivery on all orders above ₹499.
          </p>
          <p>
            • <strong>Cash on Delivery (COD):</strong> Available across 19,000+ pin codes in India.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3 pt-6 border-t border-sand-200">
      {sections.map((section) => {
        const Icon = section.icon;
        const isOpen = !!openSections[section.id];

        return (
          <div
            key={section.id}
            className="border border-sand-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-sm"
          >
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-forest-950 hover:bg-cream-50/60 transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center text-forest-900 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-serif text-sm sm:text-base font-bold">
                  {section.title}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-charcoal-500 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180 text-forest-800' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="p-4 sm:p-5 pt-0 border-t border-sand-100 animate-fade-in">
                {section.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
