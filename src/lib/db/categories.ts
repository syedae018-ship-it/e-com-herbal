import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Category } from '../types';
import { SEED_CATEGORIES } from '../seed-data';

const LOCAL_CATEGORIES_KEY = 'nutri_life_categories';

function getLocalCategories(): Category[] {
  if (typeof window === 'undefined') return SEED_CATEGORIES;
  try {
    const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (!raw) return SEED_CATEGORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((cat: Category) => {
        const seed = SEED_CATEGORIES.find((s) => s.id === cat.id || s.slug === cat.slug);
        if (seed) {
          const hasCustomUpload = cat.image_url?.startsWith('data:image/');
          if (!hasCustomUpload) {
            return { ...cat, image_url: seed.image_url };
          }
        }
        return cat;
      });
    }
    return SEED_CATEGORIES;
  } catch (err) {
    return SEED_CATEGORIES;
  }
}

function saveLocalCategories(cats: Category[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(cats));
    window.dispatchEvent(new CustomEvent('nutri_life_categories_updated'));
  } catch (err) {
    console.error('Failed to persist categories to localStorage', err);
  }
}

/**
 * Retrieves all active categories from Supabase (or fallback seed data/local storage).
 */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return getLocalCategories();
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalCategories();
    }

    return data as Category[];
  } catch (err) {
    console.error('Error fetching categories from Supabase:', err);
    return getLocalCategories();
  }
}

/**
 * Retrieves a single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) || null;
}

/**
 * Creates a new category.
 */
export async function createCategory(
  category: Omit<Category, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: Category; error?: string }> {
  const newCat: Category = {
    ...category,
    id: `cat-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured() || !supabase) {
    const current = getLocalCategories();
    const updated = [...current, newCat];
    saveLocalCategories(updated);
    return { success: true, data: newCat };
  }

  try {
    const { data, error } = await supabase.from('categories').insert([category]).select().single();
    if (error) {
      // Fallback
      const current = getLocalCategories();
      saveLocalCategories([...current, newCat]);
      return { success: true, data: newCat };
    }
    return { success: true, data: data as Category };
  } catch (err: any) {
    const current = getLocalCategories();
    saveLocalCategories([...current, newCat]);
    return { success: true, data: newCat };
  }
}

/**
 * Updates an existing category.
 */
export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<{ success: boolean; data?: Category; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    const current = getLocalCategories();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveLocalCategories(updated);
    const cat = updated.find((c) => c.id === id);
    return { success: true, data: cat };
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const current = getLocalCategories();
      const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveLocalCategories(updated);
      return { success: true, data: updated.find((c) => c.id === id) };
    }
    return { success: true, data: data as Category };
  } catch (err: any) {
    const current = getLocalCategories();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveLocalCategories(updated);
    return { success: true, data: updated.find((c) => c.id === id) };
  }
}

/**
 * Deletes a category.
 */
export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    const current = getLocalCategories();
    const updated = current.filter((c) => c.id !== id);
    saveLocalCategories(updated);
    return { success: true };
  }

  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      const current = getLocalCategories();
      saveLocalCategories(current.filter((c) => c.id !== id));
      return { success: true };
    }
    return { success: true };
  } catch (err: any) {
    const current = getLocalCategories();
    saveLocalCategories(current.filter((c) => c.id !== id));
    return { success: true };
  }
}

