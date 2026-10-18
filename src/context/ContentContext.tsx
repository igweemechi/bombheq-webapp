import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '../types/content';
import defaultData from '../data/defaultContent.json';

const STORAGE_KEY = 'bombheq_site_content_v1';

interface ContentContextType {
  content: SiteContent;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  setFullContent: (newContent: SiteContent) => void;
  resetToDefault: () => void;
  isCmsOpen: boolean;
  setIsCmsOpen: (open: boolean) => void;
  toggleCms: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  exportJson: () => string;
  downloadJsonFile: () => void;
  importJson: (jsonString: string) => { success: boolean; message: string };
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    const defaults = defaultData as unknown as SiteContent;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SiteContent;
        if (parsed && parsed.company && parsed.services) {
          if (Array.isArray(parsed.caseStudies)) {
            parsed.caseStudies = parsed.caseStudies.map(cs => {
              const defaultCs = defaults.caseStudies.find(d => d.id === cs.id);
              return {
                ...cs,
                milestones: cs.milestones && cs.milestones.length > 0 ? cs.milestones : defaultCs?.milestones
              };
            });
          }
          if (parsed.team && Array.isArray(parsed.team.members)) {
            parsed.team.members = parsed.team.members.map(m => {
              const defaultMember = defaults.team.members.find(d => d.id === m.id || d.name === m.name);
              return {
                ...m,
                yearsExperience: m.yearsExperience || defaultMember?.yearsExperience,
                keyCredentials: m.keyCredentials && m.keyCredentials.length > 0 ? m.keyCredentials : defaultMember?.keyCredentials,
                skillMatrix: m.skillMatrix && m.skillMatrix.length > 0 ? m.skillMatrix : defaultMember?.skillMatrix
              };
            });
          }
          if (!parsed.faqs || parsed.faqs.length === 0) {
            parsed.faqs = defaults.faqs;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read cached site content, using defaults:', e);
    }
    return defaults;
  });

  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to document title whenever company or title changes
  useEffect(() => {
    if (content?.company?.name) {
      document.title = `${content.company.name} | ${content.company.tagline || 'Consulting Engineers'}`;
    }
  }, [content]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  const updateContent = (updater: (prev: SiteContent) => SiteContent) => {
    setContent(prev => {
      const updated = updater(prev);
      updated.lastUpdated = new Date().toISOString().split('T')[0];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return updated;
    });
    showToast('Changes saved to CMS and rendered instantly');
  };

  const setFullContent = (newContent: SiteContent) => {
    newContent.lastUpdated = new Date().toISOString().split('T')[0];
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    showToast('Site content updated');
  };

  const resetToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setContent(defaultData as unknown as SiteContent);
    showToast('Reset to original default content');
  };

  const toggleCms = () => setIsCmsOpen(prev => !prev);

  const exportJson = (): string => {
    return JSON.stringify(content, null, 2);
  };

  const downloadJsonFile = () => {
    const jsonStr = exportJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bombheq-site-content-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded site content JSON file');
  };

  const importJson = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.company || !parsed.services || !parsed.caseStudies) {
        return {
          success: false,
          message: 'Invalid schema: JSON must contain company, services, and caseStudies properties.'
        };
      }
      setFullContent(parsed as SiteContent);
      return { success: true, message: 'Content imported successfully!' };
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Invalid JSON syntax'
      };
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContent,
        setFullContent,
        resetToDefault,
        isCmsOpen,
        setIsCmsOpen,
        toggleCms,
        activeView,
        setActiveView,
        focusedItemId,
        setFocusedItemId,
        isSearchOpen,
        setIsSearchOpen,
        exportJson,
        downloadJsonFile,
        importJson,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
