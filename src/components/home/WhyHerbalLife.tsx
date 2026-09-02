import React from 'react';
import { Sprout, Compass, Ban, HeartHandshake } from 'lucide-react';

export const WhyHerbalLife: React.FC = () => {
  const reasons = [
    {
      icon: Sprout,
      title: 'Plant Based',
      description: '100% vegetarian and vegan-friendly formulas derived exclusively from whole botanicals, flowers, roots, and seeds.',
    },
    {
      icon: Compass,
      title: 'Thoughtfully Sourced',
      description: 'We partner directly with certified organic growers who practice regenerative and chemical-free agriculture.',
    },
    {
      icon: Ban,
      title: 'No Unnecessary Additives',
      description: 'Strictly zero petroleum derivatives, phthalates, synthetic preservatives, bleaching agents, or heavy metal residues.',
    },
    {
      icon: HeartHandshake,
      title: 'Made for Everyday Wellness',
      description: 'Gentle, bio-compatible formulations designed to be used safely, consistently, and effectively every single day.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Our Standard of Purity
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
            Why Choose Mustafa Life
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            We hold our products to the highest standards of clean holistic wellness.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
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
