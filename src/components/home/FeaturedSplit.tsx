'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWebsiteContent } from '@/context/ContentContext';

export const FeaturedSplit: React.FC = () => {
  const { content } = useWebsiteContent();
  const section = content.featured_split;

  if (section.is_enabled === false) {
    return null;
  }

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
                src={section.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80'}
                alt={section.heading_line1 || 'Herbal E Com Life Botanical Extraction'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                {section.image_tag && (
                  <span className="text-[10px] tracking-widest uppercase font-bold text-sage-300">
                    {section.image_tag}
                  </span>
                )}
                {section.image_tag_sub && (
                  <p className="font-serif text-lg font-bold text-white mt-1">
                    {section.image_tag_sub}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Copy Section */}
          <div className="lg:col-span-6 space-y-6">
            {section.badge_text && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-forest-800 text-sage-300 text-xs font-semibold">
                <span>{section.badge_text}</span>
              </div>
            )}

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {section.heading_line1} <br />
              <span className="text-sage-300 italic font-normal">{section.heading_line2_highlight}</span>
            </h2>

            <p className="text-sm sm:text-base text-sage-100/90 leading-relaxed font-sans">
              {section.description}
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-sage-200">
              {section.bullet1 && (
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sage-400 shrink-0" />
                  <span>{section.bullet1}</span>
                </li>
              )}
              {section.bullet2 && (
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sage-400 shrink-0" />
                  <span>{section.bullet2}</span>
                </li>
              )}
              {section.bullet3 && (
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sage-400 shrink-0" />
                  <span>{section.bullet3}</span>
                </li>
              )}
            </ul>

            {section.button_text && (
              <div className="pt-4">
                <Link
                  href={section.button_link || '/shop'}
                  className="inline-flex items-center gap-2 bg-cream-100 text-forest-950 hover:bg-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-colors text-sm"
                >
                  <span>{section.button_text}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

