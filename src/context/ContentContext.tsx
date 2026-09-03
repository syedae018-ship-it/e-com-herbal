'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WebsiteContent } from '@/lib/types';
import {
  DEFAULT_WEBSITE_CONTENT,
  getWebsiteContent,
  updateWebsiteSection,
  resetWebsiteSection,
} from '@/lib/db/content';

interface ContentContextType {
  content: WebsiteContent;
  loading: boolean;
  updateSection: <K extends keyof WebsiteContent>(
    key: K,
    data: WebsiteContent[K]
  ) => Promise<{ success: boolean; error?: string }>;
  resetSection: (key?: keyof WebsiteContent) => Promise<{ success: boolean }>;
  reloadContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<WebsiteContent>(DEFAULT_WEBSITE_CONTENT);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const data = await getWebsiteContent();
      setContent(data);
    } catch (err) {
      console.error('Failed to load website content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    const handleContentUpdate = () => {
      fetchContent();
    };

    window.addEventListener('mustafa_life_content_updated', handleContentUpdate);
    window.addEventListener('storage', handleContentUpdate);

    return () => {
      window.removeEventListener('mustafa_life_content_updated', handleContentUpdate);
      window.removeEventListener('storage', handleContentUpdate);
    };
  }, [fetchContent]);

  const updateSection = async <K extends keyof WebsiteContent>(
    key: K,
    data: WebsiteContent[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: data,
    }));
    const res = await updateWebsiteSection(key, data);
    return res;
  };

  const resetSection = async (key?: keyof WebsiteContent) => {
    const res = await resetWebsiteSection(key);
    await fetchContent();
    return res;
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        updateSection,
        resetSection,
        reloadContent: fetchContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useWebsiteContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useWebsiteContent must be used within a ContentProvider');
  }
  return context;
};
