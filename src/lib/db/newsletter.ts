import { supabase, isSupabaseConfigured } from '../supabase/client';

/**
 * Subscribes an email to the newsletter in Supabase newsletter_subscribers table.
 */
export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const cleanEmail = email.toLowerCase().trim();

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true, message: 'Thank you for subscribing to Mustafa Life wellness updates!' };
  }

  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: cleanEmail });

    if (error) {
      if (error.code === '23505') {
        // Postgres Unique violation code
        return { success: true, message: 'You are already subscribed to our newsletter!' };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Thank you for subscribing to Mustafa Life wellness updates!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Something went wrong. Please try again.' };
  }
}
