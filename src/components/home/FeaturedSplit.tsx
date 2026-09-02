import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const FeaturedSplit: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-forest-950 text-cream-50 overflow-hidden relative">
      {/* Decorative leaf blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest-800/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Image Showcase */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-forest-800">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80"
                alt="Mustafa Life Botanical Extraction"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] tracking-widest uppercase font-bold text-sage-300">
                  Zero Compromise Philosophy
                </span>
                <p className="font-serif text-lg font-bold text-white mt-1">
                  Rooted in ancient Ayurveda. Perfected by modern lab standards.
                </p>
              </div>
            </div>
          </div>

          {/* Right Copy Section */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-forest-800 text-sage-300 text-xs font-semibold">
              <span>Pure & Honest Formulations</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Simple Ingredients. <br />
              <span className="text-sage-300 italic font-normal">Powerful Nature.</span>
            </h2>

            <p className="text-sm sm:text-base text-sage-100/90 leading-relaxed font-sans">
              We believe everyday wellness starts with honest ingredients and mindful choices. No fillers, no hidden nasties, and no artificial shortcuts. Just whole, potent botanicals formulated to nurture your body inside and out.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-sage-200">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sage-400 shrink-0" />
                <span>Single-origin herbs harvested at peak bioactive potency</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sage-400 shrink-0" />
                <span>Zero artificial colors, synthetic binders, or parabens</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sage-400 shrink-0" />
                <span>Transparent full-ingredient disclosure on every bottle</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-cream-100 text-forest-950 hover:bg-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-colors text-sm"
              >
                <span>EXPLORE PRODUCTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
