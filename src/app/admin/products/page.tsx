'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProductsAdmin, deleteProduct, updateProduct } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';
import { Product, Category } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([getAllProductsAdmin(), getCategories()]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      const res = await deleteProduct(id);
      if (res.success) {
        setStatusMessage(`Product "${name}" deleted.`);
        loadData();
        setTimeout(() => setStatusMessage(''), 3000);
      }
    }
  };

  const handleToggleActive = async (product: Product) => {
    const res = await updateProduct(product.id, { is_active: !product.is_active });
    if (res.success) {
      loadData();
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory ? p.category_id === selectedCategory : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6 font-admin-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60">
        <div>
          <h1 className="font-admin-heading text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
            Products
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage your store catalog, pricing, inventory stock, and visibility.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 bg-forest-900 text-white hover:bg-forest-800 font-medium px-3.5 py-2 rounded-lg text-xs transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </Link>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title..."
            className="w-full bg-zinc-50/70 border border-zinc-200 rounded-lg px-3 py-2 pl-8 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-zinc-50/70 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-forest-800 focus:border-forest-800 transition-colors"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-zinc-400 whitespace-nowrap hidden sm:inline">
            {filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-zinc-400">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Package className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-xs text-zinc-600 font-medium">No products match your criteria</p>
            <p className="text-[11px] text-zinc-400">Try adjusting your search query or category filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] bg-zinc-50/50">
                  <th className="py-3 px-5 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-admin-body">
                {filteredProducts.map((product) => {
                  const stockCount = product.stock ?? 0;
                  const isOut = stockCount <= 0;
                  const isLow = stockCount > 0 && stockCount <= 15;

                  return (
                    <tr key={product.id} className="hover:bg-zinc-50/60 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
                            {product.images && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-[240px]">
                            <p className="font-medium text-zinc-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate">
                              {product.short_description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-zinc-600">
                        <span className="text-[11px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60">
                          {product.category?.name || 'Ayurvedic'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-admin-heading font-medium text-zinc-950 tabular-nums">
                          {formatINR(product.price)}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="block text-[10px] text-zinc-400 line-through tabular-nums">
                            {formatINR(product.original_price)}
                          </span>
                        )}
                      </td>

                      {/* Stock Level with Semantic Dot */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                            isOut
                              ? 'bg-rose-50 text-rose-800 border-rose-200/80'
                              : isLow
                              ? 'bg-amber-50 text-amber-800 border-amber-200/80'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span>
                            {isOut ? 'Out of stock' : `${stockCount} units`}
                          </span>
                        </span>
                      </td>

                      {/* Active / Hidden Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            product.is_active
                              ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200/70'
                              : 'bg-zinc-100 text-zinc-400 line-through'
                          }`}
                          title="Click to toggle visibility"
                        >
                          {product.is_active ? (
                            <>
                              <Eye className="w-3 h-3 text-zinc-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-zinc-400" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
