'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';
import { Product, Category } from '@/lib/types';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { FilterPanel } from '@/components/shop/FilterPanel';
import { SearchBar } from '@/components/shop/SearchBar';
import { Filter, ArrowUpDown, X } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSort = (searchParams.get('sort') as any) || 'featured';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high'>(
    initialSort === 'bestsellers' ? 'featured' : initialSort
  );

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }
    loadData();
  }, []);

  // Update query params if initial changes
  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialSearch, initialCategory]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setInStockOnly(false);
    setSortBy('featured');
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          (p.ingredients && p.ingredients.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    if (priceRange[1] < 1000) {
      result = result.filter((p) => p.price <= priceRange[1]);
    }

    if (inStockOnly) {
      result = result.filter((p) => (p.stock ?? 0) > 0);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
    } else {
      // featured
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, categories, search, selectedCategory, priceRange, inStockOnly, sortBy]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-[#fbfaf8] font-admin-body text-zinc-900">
      <div className="max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6">
        {/* Compact Banner Header */}
        <div className="bg-forest-950 text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="max-w-2xl space-y-1.5 relative z-10">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-emerald-300">
              Clean Botanical Formulations
            </span>
            <h1 className="font-admin-heading text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              All Organic Products
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              Discover our complete collection of handcrafted herbal soaps, pure hair oils, botanical face washes, rich creams, and everyday body care.
            </p>
          </div>
          {/* Subtle decorative glow */}
          <div className="absolute right-0 top-0 w-96 h-full bg-forest-900/40 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Main Content Layout: Compact Sidebar + Wide Product Grid */}
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
          {/* Desktop Filter Sidebar (240px - 260px) */}
          <aside className="hidden lg:block w-60 xl:w-64 shrink-0 sticky top-24">
            <FilterPanel
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              inStockOnly={inStockOnly}
              onStockToggle={setInStockOnly}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs bg-white h-full p-4 overflow-y-auto z-10 shadow-2xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                  <h3 className="font-admin-heading text-sm font-semibold text-zinc-950">
                    Filters & Categories
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <FilterPanel
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setMobileFilterOpen(false);
                  }}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  inStockOnly={inStockOnly}
                  onStockToggle={setInStockOnly}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          )}

          {/* Right Area: Search + Sort Toolbar & Wide Product Grid */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* 7. Search + Sort Bar directly above the grid */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
              {/* Search input (intelligently utilizes available space) */}
              <div className="flex-1 min-w-0">
                <SearchBar value={search} onChange={setSearch} />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 bg-white border border-zinc-200/90 rounded-lg px-3 py-2 text-xs font-medium text-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-zinc-50 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Filters</span>
                </button>

                {/* Compact Sort Control */}
                <div className="flex items-center gap-1.5 bg-white border border-zinc-200/90 rounded-lg px-2.5 py-1.5 sm:py-2 text-xs font-medium text-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-zinc-300 transition-colors">
                  <ArrowUpDown className="w-3 h-3 text-zinc-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none focus:outline-none cursor-pointer pr-1 text-xs text-zinc-800 font-medium"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results count & Active filters status */}
            <div className="flex items-center justify-between text-xs text-zinc-500 pt-0.5">
              <span>
                Showing <strong className="text-zinc-900 font-semibold">{filteredProducts.length}</strong> products
              </span>

              {selectedCategory && activeCategoryObj && (
                <div className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-md text-[11px] font-medium border border-zinc-200/70">
                  <span>Category: {activeCategoryObj.name}</span>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="hover:text-rose-600"
                    title="Clear category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* 12. Wide 4-Column Product Grid with 4:5 Cards */}
            <ProductGrid
              products={filteredProducts}
              isLoading={loading}
              emptyTitle="No products match your criteria"
              emptyMessage="Try adjusting your search terms, changing the category, or expanding the price range slider."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-16 bg-[#fbfaf8] flex items-center justify-center">
          <div className="animate-spin rounded-full h-7 w-7 border-2 border-forest-800 border-t-transparent" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
