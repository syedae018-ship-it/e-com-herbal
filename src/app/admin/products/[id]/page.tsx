'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllProductsAdmin, updateProduct } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';
import { Product, Category } from '@/lib/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { ArrowLeft, Package } from 'lucide-react';

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
    <div className="space-y-6 font-admin-body">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60">
        <div>
          <h1 className="font-admin-heading text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
            Edit Product
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Update specifications, pricing, inventory stock, and gallery imagery.
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
        <div className="py-16 text-center text-xs text-zinc-400">Loading product details...</div>
      ) : !product ? (
        <div className="bg-white p-8 rounded-xl border border-zinc-200/80 text-center space-y-3">
          <Package className="w-8 h-8 text-zinc-300 mx-auto" />
          <p className="text-xs text-zinc-600 font-medium">Product record not found.</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="text-xs font-medium text-forest-900 hover:underline"
          >
            Return to Products Catalog
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
