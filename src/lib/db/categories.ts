import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Category } from '../types';
import { SEED_CATEGORIES } from '../seed-data';

/**
 * Retrieves all active categories from Supabase (or fallback seed data if offline).
 */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return SEED_CATEGORIES;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Falling back to seed categories:', error?.message);
      return SEED_CATEGORIES;
    }

    return data as Category[];
  } catch (err) {
    console.error('Error fetching categories from Supabase:', err);
    return SEED_CATEGORIES;
  }
}

/**
 * Retrieves a single category by slug from Supabase.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return SEED_CATEGORIES.find((c) => c.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return SEED_CATEGORIES.find((c) => c.slug === slug) || null;
    }

    return data as Category;
  } catch (err) {
    console.error('Error fetching category by slug:', err);
    return SEED_CATEGORIES.find((c) => c.slug === slug) || null;
  }
}
