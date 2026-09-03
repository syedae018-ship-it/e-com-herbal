'use client';

import React from 'react';
import { Leaf, FlaskConical, HeartHandshake, Sparkles, ShieldCheck, Award } from 'lucide-react';
import { useWebsiteContent } from '@/context/ContentContext';

const ICON_MAP: Record<string, any> = {
  leaf: Leaf,
  flask: FlaskConical,
  heart: HeartHandshake,
  sparkles: Sparkles,
  shield: ShieldCheck,
  award: Award,
};

export const TrustBenefits: React.FC = () => {
  const { content } = useWebsiteContent();
  const section = content.trust_benefits;

  if (section.is_enabled === false) {
    return null;
  }

  return (
    <section className="py-12 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.items.map((item, index) => {
            const IconComponent = ICON_MAP[item.icon] || Leaf;
            return (
              <div
                key={item.id || index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-cream-50/60 border border-sand-200/80 hover:border-sage-300 hover:bg-cream-50 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-forest-900 shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-sm font-bold text-forest-950">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

