'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllProductsAdmin, updateProduct } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';
import { Product, Category } from '@/lib/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [prods, cats] = await Promise.all([getAllProductsAdmin(), getCategories()]);
      const found = prods.find((p) => p.id === productId);
      if (found) {
        setProduct(found);
      }
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, [productId]);

  const handleUpdate = async (productData: any, images: string[]) => {
    return await updateProduct(productId, productData, images);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Edit Product
          </h1>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-forest-800 hover:text-forest-950"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-charcoal-500">Loading product...</div>
      ) : !product ? (
        <div className="bg-white p-8 rounded-2xl border border-sand-200 text-center space-y-3">
          <p className="text-xs text-charcoal-600">Product not found.</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="text-xs font-bold text-forest-900 underline"
          >
            Return to Products List
          </button>
        </div>
      ) : (
        <ProductForm
          initialData={product}
          categories={categories}
          onSubmit={handleUpdate}
          isEditing={true}
        />
      )}
    </div>
  );
}
