import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts, getProducts } from '@/lib/db/products';
import { ProductDetailClient } from './ProductDetailClient';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ChevronRight } from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id, 4);

  return (
    <div className="min-h-screen py-10 bg-cream-100/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-500 font-medium overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-forest-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-charcoal-400" />
          <Link href="/shop" className="hover:text-forest-900 transition-colors">
            Shop
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3 text-charcoal-400" />
              <Link
                href={`/category/${product.category.slug}`}
                className="hover:text-forest-900 transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-charcoal-400" />
          <span className="text-forest-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Interactive Client Product Section */}
        <ProductDetailClient product={product} />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
