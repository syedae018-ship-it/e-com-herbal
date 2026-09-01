'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/lib/db/products';
import { getCategories } from '@/lib/db/categories';
import { Product, Category } from '@/lib/types';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { FilterPanel } from '@/components/shop/FilterPanel';
import { SearchBar } from '@/components/shop/SearchBar';
import { Filter, ArrowUpDown } from 'lucide-react';

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
      result = result.filter((p) => p.stock > 0);
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

  return (
    <div className="min-h-screen py-10 bg-cream-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Banner */}
        <div className="bg-gradient-to-r from-forest-950 to-forest-900 text-cream-50 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="max-w-xl space-y-2 relative z-10">
            <span className="text-[11px] uppercase tracking-widest font-bold text-sage-300">
              Clean Botanical Formulations
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              All Organic Products
            </h1>
            <p className="text-xs sm:text-sm text-sage-200/90 leading-relaxed font-sans">
              Discover our complete collection of certified organic herbal tablets, superfoods, pure cold-pressed oils, and gentle botanical skincare.
            </p>
          </div>
        </div>

        {/* Search & Mobile Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-white border border-sand-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-forest-900 shadow-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-sand-300 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal-800 shadow-sm ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none focus:outline-none cursor-pointer pr-1"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content: Left Filter Sidebar + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-28">
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
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 overflow-y-auto z-10 shadow-2xl">
                <div className="flex justify-between items-center pb-4 border-b border-sand-200 mb-4">
                  <h3 className="font-serif text-base font-bold text-forest-950">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-xs font-bold text-forest-900 px-3 py-1 bg-sand-100 rounded-lg"
                  >
                    Done
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

          {/* Product Grid Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between text-xs text-charcoal-600">
              <span>
                Showing <strong>{filteredProducts.length}</strong> organic products
              </span>
              {selectedCategory && (
                <span className="bg-sage-100 text-forest-900 font-semibold px-2.5 py-1 rounded-full">
                  Category:{' '}
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              )}
            </div>

            {/* Product Grid */}
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
        <div className="min-h-screen py-16 bg-cream-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-forest-800 border-t-transparent" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
