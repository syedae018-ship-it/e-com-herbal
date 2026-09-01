import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Flame, Zap, Apple, Activity, ArrowRight } from 'lucide-react';

export const ShopByNeed: React.FC = () => {
  const needs = [
    {
      icon: Shield,
      title: 'Better Immunity',
      desc: 'Giloy, Tulsi, and Vitamin C extracts to defend against seasonal pollutants.',
      slug: 'herbal-wellness',
      bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    },
    {
      icon: Sparkles,
      title: 'Healthy Skin',
      desc: 'Aloe Vera, Rose, and Turmeric tonics to replenish deep natural radiance.',
      slug: 'natural-skincare',
      bgClass: 'bg-rose-50 text-rose-800 border-rose-100',
    },
    {
      icon: Flame,
      title: 'Stronger Hair',
      desc: 'Bhringraj, Amla, and Rosemary decoctions for denser roots and shine.',
      slug: 'hair-care',
      bgClass: 'bg-amber-50 text-amber-800 border-amber-100',
    },
    {
      icon: Zap,
      title: 'Daily Energy',
      desc: 'Organic Moringa and Ashwagandha to combat fatigue and revitalize stamina.',
      slug: 'healthy-nutrition',
      bgClass: 'bg-teal-50 text-teal-800 border-teal-100',
    },
    {
      icon: Apple,
      title: 'Digestive Wellness',
      desc: 'Raw forest honey and gut-nourishing superfoods for comfortable digestion.',
      slug: 'healthy-nutrition',
      bgClass: 'bg-lime-50 text-lime-800 border-lime-100',
    },
    {
      icon: Activity,
      title: 'Stress & Sleep',
      desc: 'KSM-66 full-spectrum adaptogens to soothe mind and support restful nights.',
      slug: 'herbal-wellness',
      bgClass: 'bg-indigo-50 text-indigo-800 border-indigo-100',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-cream-100/60 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Targeted Solutions
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest-950">
            Shop by Your Need
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Target specific wellness goals with scientifically formulated Ayurvedic remedies.
          </p>
        </div>

        {/* Needs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {needs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={`/category/${item.slug}`}
                className="group bg-white p-6 rounded-2xl border border-sand-200 shadow-sm hover:shadow-card transition-all duration-200 flex flex-col justify-between space-y-4 hover:border-forest-700/30"
              >
                <div className="space-y-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.bgClass}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-forest-950 group-hover:text-forest-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-sand-100 flex items-center justify-between text-xs font-bold text-forest-900 group-hover:text-forest-700">
                  <span>Explore Remedies</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
