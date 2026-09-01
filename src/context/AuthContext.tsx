'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile, UserRole } from '@/lib/types';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (fullName: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  loginAsDemoAdmin: () => void;
  loginAsDemoCustomer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'herbal_life_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id, session.user.email || '');
          }
        } catch (err) {
          console.error('Error initializing Supabase session:', err);
        }
      } else {
        // Load local simulated session for preview mode
        try {
          const savedSession = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            setUser({ id: parsed.id, email: parsed.email });
            setProfile(parsed);
          }
        } catch (err) {
          console.error('Error loading local session:', err);
        }
      }
      setLoading(false);
    }

    initAuth();

    // Listen for live Supabase Auth state changes
    if (isSupabaseConfigured() && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  async function fetchProfile(userId: string, email: string) {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data as Profile);
      } else {
        // Create or fallback default profile
        const defaultProfile: Profile = {
          id: userId,
          full_name: email.split('@')[0],
          email: email,
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        setProfile(defaultProfile);
      }
    } catch (err) {
      console.error('Error fetching profile from Supabase:', err);
    }
  }

  const signIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email) return { success: false, error: 'Email is required.' };

    if (isSupabaseConfigured() && supabase) {
      if (!password) return { success: false, error: 'Password is required.' };
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email || '');
      }
      return { success: true };
    }

    // Local simulated auth for preview
    const isMockAdmin = email.toLowerCase().includes('admin');
    const mockProfile: Profile = {
      id: `usr-${Date.now()}`,
      full_name: isMockAdmin ? 'Herbal Life Admin' : email.split('@')[0],
      email: email,
      role: isMockAdmin ? 'admin' : 'customer',
      created_at: new Date().toISOString(),
    };

    setUser({ id: mockProfile.id, email: mockProfile.email });
    setProfile(mockProfile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockProfile));
    return { success: true };
  };

  const signUp = async (fullName: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!fullName || !email) return { success: false, error: 'Name and email are required.' };

    if (isSupabaseConfigured() && supabase) {
      if (!password) return { success: false, error: 'Password is required.' };
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email || '');
      }
      return { success: true };
    }

    // Local simulated signup
    const mockProfile: Profile = {
      id: `usr-${Date.now()}`,
      full_name: fullName.trim(),
      email: email.trim(),
      role: 'customer',
      created_at: new Date().toISOString(),
    };

    setUser({ id: mockProfile.id, email: mockProfile.email });
    setProfile(mockProfile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockProfile));
    return { success: true };
  };

  const signOut = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Error signing out from Supabase:', e);
      }
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const loginAsDemoAdmin = () => {
    const adminProf: Profile = {
      id: 'admin-demo-1',
      full_name: 'Store Administrator',
      email: 'admin@herballife.com',
      role: 'admin',
      created_at: new Date().toISOString(),
    };
    setUser({ id: adminProf.id, email: adminProf.email });
    setProfile(adminProf);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminProf));
  };

  const loginAsDemoCustomer = () => {
    const custProf: Profile = {
      id: 'cust-demo-1',
      full_name: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    setUser({ id: custProf.id, email: custProf.email });
    setProfile(custProf);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(custProf));
  };

  const role = profile?.role || 'customer';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        loginAsDemoAdmin,
        loginAsDemoCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
