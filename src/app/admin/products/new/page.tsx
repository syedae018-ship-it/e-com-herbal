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
    <div className="space-y-6 font-admin-body">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60">
        <div>
          <h1 className="font-admin-heading text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
            Add New Product
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Publish a new botanical formula to the Herbal E Com Life catalog.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">Loading form resources...</div>
      ) : (
        <ProductForm categories={categories} onSubmit={handleCreate} isEditing={false} />
      )}
    </div>
  );
}
