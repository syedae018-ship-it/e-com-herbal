'use client';

import React from 'react';
import { Sprout, Compass, Ban, HeartHandshake, ShieldCheck, Award, Sparkles, Leaf } from 'lucide-react';
import { useWebsiteContent } from '@/context/ContentContext';

const ICON_MAP: Record<string, any> = {
  sprout: Sprout,
  compass: Compass,
  ban: Ban,
  heart: HeartHandshake,
  shield: ShieldCheck,
  award: Award,
  sparkles: Sparkles,
  leaf: Leaf,
};

export const WhyHerbalLife: React.FC = () => {
  const { content } = useWebsiteContent();
  const section = content.why_herbal_life;

  if (section.is_enabled === false) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {section.badge_text && (
            <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
              {section.badge_text}
            </span>
          )}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
            {section.heading || 'Why Choose Herbal E Com Life'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            {section.subtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.items.map((reason, index) => {
            const Icon = ICON_MAP[reason.icon] || Sprout;
            return (
              <div
                key={reason.id || index}
                className="bg-cream-50 p-6 rounded-2xl border border-sand-200 hover:border-sage-400 hover:bg-cream-100 transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-forest-900 text-cream-50 flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6 text-sage-300" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-base font-bold text-forest-950">
                    {reason.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {reason.description}
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

