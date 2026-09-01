import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getCategories } from '@/lib/db/categories';
import { getProducts } from '@/lib/db/products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ categoryId: category.id });

  return (
    <div className="min-h-screen py-10 bg-cream-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-500 font-medium">
          <Link href="/" className="hover:text-forest-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-charcoal-400" />
          <Link href="/shop" className="hover:text-forest-900 transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-charcoal-400" />
          <span className="text-forest-900 font-bold">{category.name}</span>
        </nav>

        {/* Category Hero Banner */}
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-800 text-cream-50 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="text-[11px] uppercase tracking-widest font-bold text-sage-300">
              Herbal Life Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-sage-100 leading-relaxed">
              {category.description ||
                'Thoughtfully crafted organic herbal formulas designed for daily vitality.'}
            </p>
          </div>
        </div>

        {/* Back Link & Product Count */}
        <div className="flex items-center justify-between">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View All Categories</span>
          </Link>

          <span className="text-xs text-charcoal-500">
            Showing <strong>{products.length}</strong> items in {category.name}
          </span>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          emptyTitle={`No products currently in ${category.name}`}
          emptyMessage="We are actively crafting fresh batches for this collection. Please check back soon or browse our other categories."
        />
      </div>
    </div>
  );
}
