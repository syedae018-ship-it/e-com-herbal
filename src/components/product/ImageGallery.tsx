'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const imageList =
    images.length > 0
      ? images
      : [
          '/images/fallback.svg',
        ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] shrink-0 py-1">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 sm:w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                activeIndex === idx
                  ? 'border-forest-900 shadow-sm ring-2 ring-forest-800/20'
                  : 'border-sand-200 hover:border-forest-400 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-sand-100 border border-sand-200 shadow-sm">
        <Image
          src={imageList[activeIndex] || imageList[0]}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-all duration-300"
        />
      </div>
    </div>
  );
};
