import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Product } from '../types';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../seed-data';

// Local in-memory store for offline development and initial zero-config preview
let localProducts: Product[] = [...SEED_PRODUCTS];

export interface GetProductsFilter {
  categorySlug?: string;
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?: 'featured' | 'newest' | 'price-low' | 'price-high';
}

/**
 * Queries active products from Supabase with relational categories and images.
 */
export async function getProducts(filter: GetProductsFilter = {}): Promise<Product[]> {
  if (!isSupabaseConfigured() || !supabase) {
    let result = [...localProducts].filter((p) => p.is_active);

    if (filter.featuredOnly) {
      result = result.filter((p) => p.featured);
    }

    if (filter.categorySlug) {
      const cat = SEED_CATEGORIES.find((c) => c.slug === filter.categorySlug);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    if (filter.categoryId) {
      result = result.filter((p) => p.category_id === filter.categoryId);
    }

    if (filter.search) {
      const query = filter.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.short_description.toLowerCase().includes(query) ||
          (p.ingredients && p.ingredients.toLowerCase().includes(query))
      );
    }

    if (filter.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filter.maxPrice!);
    }

    if (filter.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    if (filter.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filter.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filter.sortBy === 'newest') {
      result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
    }

    return result;
  }

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_images(*)
      `)
      .eq('is_active', true);

    if (filter.featuredOnly) {
      query = query.eq('featured', true);
    }

    if (filter.categoryId) {
      query = query.eq('category_id', filter.categoryId);
    }

    if (filter.search) {
      query = query.ilike('name', `%${filter.search}%`);
    }

    if (filter.minPrice !== undefined) {
      query = query.gte('price', filter.minPrice);
    }

    if (filter.maxPrice !== undefined) {
      query = query.lte('price', filter.maxPrice);
    }

    if (filter.inStockOnly) {
      query = query.gt('stock', 0);
    }

    if (filter.sortBy === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (filter.sortBy === 'price-high') {
      query = query.order('price', { ascending: false });
    } else if (filter.sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      console.warn('Falling back to local products store:', error?.message);
      return localProducts.filter((p) => p.is_active);
    }

    const mapped: Product[] = data.map((item: any) => ({
      ...item,
      images: item.product_images && item.product_images.length > 0
        ? item.product_images.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.image_url)
        : [],
    }));

    return mapped;
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return localProducts.filter((p) => p.is_active);
  }
}

/**
 * Fetches a single product by slug from Supabase.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return localProducts.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_images(*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return localProducts.find((p) => p.slug === slug) || null;
    }

    const product: Product = {
      ...data,
      images: data.product_images && data.product_images.length > 0
        ? data.product_images.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.image_url)
        : [],
    };

    return product;
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return localProducts.find((p) => p.slug === slug) || null;
  }
}

/**
 * Fetches related products belonging to the same category.
 */
export async function getRelatedProducts(currentProductId: string, categoryId?: string, limit: number = 4): Promise<Product[]> {
  const all = await getProducts({ categoryId });
  return all.filter((p) => p.id !== currentProductId).slice(0, limit);
}

/**
 * Fetches all products (including inactive) for the Admin Portal.
 */
export async function getAllProductsAdmin(): Promise<Product[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [...localProducts];
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        product_images(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [...localProducts];
    }

    return data.map((item: any) => ({
      ...item,
      images: item.product_images && item.product_images.length > 0
        ? item.product_images.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.image_url)
        : [],
    }));
  } catch (err) {
    console.error('Error in getAllProductsAdmin:', err);
    return [...localProducts];
  }
}

/**
 * Creates a new product in Supabase and saves its associated product_images.
 */
export async function createProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
  imageUrls: string[]
): Promise<{ success: boolean; data?: Product; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    const newProduct: Product = {
      ...productData,
      id: `p-${Date.now()}`,
      images: imageUrls,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localProducts.unshift(newProduct);
    return { success: true, data: newProduct };
  }

  try {
    const { data: product, error: prodError } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        slug: productData.slug,
        short_description: productData.short_description,
        description: productData.description,
        category_id: productData.category_id || null,
        price: productData.price,
        original_price: productData.original_price || null,
        stock: productData.stock,
        featured: productData.featured || false,
        is_active: productData.is_active ?? true,
        benefits: productData.benefits || null,
        ingredients: productData.ingredients || null,
        how_to_use: productData.how_to_use || null,
      })
      .select()
      .single();

    if (prodError || !product) {
      return { success: false, error: prodError?.message || 'Failed to create product' };
    }

    // Insert images into product_images table
    if (imageUrls.length > 0) {
      const imageInserts = imageUrls.map((url, index) => ({
        product_id: product.id,
        image_url: url,
        sort_order: index + 1,
      }));
      await supabase.from('product_images').insert(imageInserts);
    }

    return { success: true, data: { ...product, images: imageUrls } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Updates an existing product in Supabase.
 */
export async function updateProduct(
  id: string,
  productData: Partial<Product>,
  imageUrls?: string[]
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    const index = localProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      localProducts[index] = {
        ...localProducts[index],
        ...productData,
        images: imageUrls || localProducts[index].images,
        updated_at: new Date().toISOString(),
      };
      return { success: true };
    }
    return { success: false, error: 'Product not found' };
  }

  try {
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name: productData.name,
        slug: productData.slug,
        short_description: productData.short_description,
        description: productData.description,
        category_id: productData.category_id || null,
        price: productData.price,
        original_price: productData.original_price || null,
        stock: productData.stock,
        featured: productData.featured,
        is_active: productData.is_active,
        benefits: productData.benefits,
        ingredients: productData.ingredients,
        how_to_use: productData.how_to_use,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    if (imageUrls && imageUrls.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', id);
      const imageInserts = imageUrls.map((url, index) => ({
        product_id: id,
        image_url: url,
        sort_order: index + 1,
      }));
      await supabase.from('product_images').insert(imageInserts);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Deletes a product from Supabase (cascades related product_images).
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    localProducts = localProducts.filter((p) => p.id !== id);
    return { success: true };
  }

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
