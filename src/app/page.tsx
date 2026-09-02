import React from 'react';
import { getCategories } from '@/lib/db/categories';
import { getProducts } from '@/lib/db/products';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustBenefits } from '@/components/home/TrustBenefits';
import { CategoryCards } from '@/components/home/CategoryCards';
import { Bestsellers } from '@/components/home/Bestsellers';
import { ShopByNeed } from '@/components/home/ShopByNeed';
import { FeaturedSplit } from '@/components/home/FeaturedSplit';
import { WhyHerbalLife } from '@/components/home/WhyHerbalLife';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { Newsletter } from '@/components/home/Newsletter';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ featuredOnly: false }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Trust & Benefits Strip */}
      <TrustBenefits />

      {/* 4. Shop by Category */}
      <CategoryCards categories={categories} />

      {/* 5. Nature's Best Sellers */}
      <Bestsellers products={products} />

      {/* 6. Shop by Your Need */}
      <ShopByNeed />

      {/* 7. Featured Split Section */}
      <FeaturedSplit />

      {/* 8. Why Mustafa Life */}
      <WhyHerbalLife />

      {/* 9. Customer Reviews */}
      <CustomerReviews />

      {/* 10. Email Newsletter */}
      <Newsletter />
    </div>
  );
}
