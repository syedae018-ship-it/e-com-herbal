'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/db/categories';
import { createProduct } from '@/lib/db/products';
import { Category } from '@/lib/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cats = await getCategories();
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, []);

  const handleCreate = async (productData: any, images: string[]) => {
    return await createProduct(productData, images);
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
            Add New Product
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
        <div className="py-12 text-center text-xs text-charcoal-500">Loading form...</div>
      ) : (
        <ProductForm categories={categories} onSubmit={handleCreate} isEditing={false} />
      )}
    </div>
  );
}
