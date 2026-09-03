'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWebsiteContent } from '@/context/ContentContext';

export const AnnouncementBar: React.FC = () => {
  const { content } = useWebsiteContent();
  const announcements =
    content.settings.announcements && content.settings.announcements.length > 0
      ? content.settings.announcements
      : ['Free Shipping on all orders above ₹499 across India'];

  const isEnabled = content.settings.announcement_bar_enabled !== false;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!isEnabled || announcements.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const currentMsg = announcements[currentIndex % announcements.length] || announcements[0];

  return (
    <div className="bg-forest-900 text-cream-100 text-xs py-2 px-4 border-b border-forest-800 tracking-wider">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="text-forest-400 hover:text-white p-0.5 transition-colors hidden sm:block"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 text-center flex items-center justify-center gap-2 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-sage-300 shrink-0 animate-pulse" />
          <span className="font-medium truncate transition-opacity duration-300">
            {currentMsg}
          </span>
        </div>

        <button
          onClick={handleNext}
          aria-label="Next announcement"
          className="text-forest-400 hover:text-white p-0.5 transition-colors hidden sm:block"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

