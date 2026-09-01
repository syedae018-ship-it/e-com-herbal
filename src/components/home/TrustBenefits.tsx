import React from 'react';
import { Leaf, FlaskConical, HeartHandshake, Sparkles } from 'lucide-react';

export const TrustBenefits: React.FC = () => {
  const benefits = [
    {
      icon: Leaf,
      title: '100% Natural Ingredients',
      description: 'Sourced directly from organic certified farms across pristine Indian terroir.',
    },
    {
      icon: FlaskConical,
      title: 'Chemical Conscious',
      description: 'Zero parabens, sulfates, silicones, synthetic fragrances, or artificial colors.',
    },
    {
      icon: HeartHandshake,
      title: 'Made with Care',
      description: 'Small batch traditional decoctions that preserve delicate bioactive phytonutrients.',
    },
    {
      icon: Sparkles,
      title: 'Cruelty Free',
      description: 'Never tested on animals. 100% vegan, ethically gathered, and environmentally safe.',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-cream-50/60 border border-sand-200/80 hover:border-sage-300 hover:bg-cream-50 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-forest-900 shrink-0">
                  <Icon className="w-6 h-6" />
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
