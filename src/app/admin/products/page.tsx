'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProductsAdmin, deleteProduct, updateProduct } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';
import { Product, Category } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Package,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
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
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const res = await deleteProduct(id);
      if (res.success) {
        setStatusMessage(`Product "${name}" deleted.`);
        loadData();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sage-600">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            Products ({products.length})
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-forest-900 text-cream-50 hover:bg-forest-800 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name..."
            className="w-full bg-sand-50/70 border border-sand-300 rounded-xl px-3 py-2 pl-9 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
          />
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-sand-50/70 border border-sand-300 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-charcoal-500">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Package className="w-8 h-8 text-charcoal-400 mx-auto" />
            <p className="text-xs text-charcoal-600">No products found matching your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-sand-50/70 border-b border-sand-200 text-charcoal-500 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Product</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Price</th>
                  <th className="py-3.5 px-4 font-bold">Stock</th>
                  <th className="py-3.5 px-4 font-bold">Featured</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filteredProducts.map((p) => {
                  const img =
                    p.images?.[0] ||
                    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=100&q=80';
                  const catName =
                    categories.find((c) => c.id === p.category_id)?.name ||
                    p.category?.name ||
                    'General';

                  return (
                    <tr key={p.id} className="hover:bg-sand-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-sand-100 shrink-0 border border-sand-200">
                            <Image src={img} alt={p.name} fill className="object-cover" sizes="40px" />
                          </div>
                          <div>
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              className="font-bold text-forest-950 hover:underline line-clamp-1"
                            >
                              {p.name}
                            </Link>
                            <span className="text-[10px] text-charcoal-400 font-mono">/{p.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-charcoal-700 font-medium">{catName}</td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-forest-900 font-sans">{formatINR(p.price)}</span>
                        {p.original_price && p.original_price > p.price && (
                          <span className="block text-[10px] text-charcoal-400 line-through">
                            {formatINR(p.original_price)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            p.stock <= 0
                              ? 'text-rose-600'
                              : p.stock < 10
                              ? 'text-amber-600'
                              : 'text-charcoal-800'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Bestseller
                          </span>
                        ) : (
                          <span className="text-charcoal-400 text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            p.is_active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                          }`}
                        >
                          {p.is_active ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-700" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="inline-block p-1.5 text-forest-800 hover:text-forest-950 hover:bg-sand-100 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
