import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

type Language = string;

interface LanguageContextType {
  language: Language;
  adminLanguage: Language;
  setLanguage: (lang: Language) => Promise<void>;
  setAdminLanguage: (lang: Language) => Promise<void>;
  t: (key: string, fallback?: string) => string;
  languages: { code: string; name: string }[];
  dir: 'ltr' | 'rtl';
  adminDir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>('en');
  const [adminLanguage, setAdminLanguageState] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  const { data: dbLanguages = [] } = useQuery<any[]>({
    queryKey: ['/api/languages'],
    staleTime: Infinity,
  });

  const loadTranslations = async (lang: string, isAdmin: boolean = false) => {
    try {
      const path = isAdmin ? `src/locales/admin/${lang}.json` : `src/locales/${lang}.json`;
      const response = await fetch(path);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data);
      } else {
        const fallbackPath = isAdmin ? 'src/locales/admin/en.json' : 'src/locales/en.json';
        const fallbackResponse = await fetch(fallbackPath);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setTranslations(fallbackData);
        }
      }
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  };

  useEffect(() => {
    const initLanguages = async () => {
      try {
        const storedMenu = localStorage.getItem('language') || 'en';
        const storedAdmin = localStorage.getItem('adminLanguage') || 'en';
        setLanguageState(storedMenu);
        setAdminLanguageState(storedAdmin);
        
        const isAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname === '/login';
        await loadTranslations(isAdmin ? storedAdmin : storedMenu, isAdmin);
        applyLanguageToDOM(isAdmin ? storedAdmin : storedMenu);
      } finally {
        setIsLoading(false);
      }
    };
    initLanguages();

    const handlePathChange = () => {
      const isAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname === '/login';
      const currentLang = isAdmin ? localStorage.getItem('adminLanguage') || 'en' : localStorage.getItem('language') || 'en';
      loadTranslations(currentLang, isAdmin);
      applyLanguageToDOM(currentLang);
    };

    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    const isAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname === '/login';
    if (!isAdmin) {
      await loadTranslations(lang, false);
      applyLanguageToDOM(lang);
    }
  };

  const setAdminLanguage = async (lang: string) => {
    setAdminLanguageState(lang);
    localStorage.setItem('adminLanguage', lang);
    const isAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname === '/login';
    if (isAdmin) {
      await loadTranslations(lang, true);
      applyLanguageToDOM(lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    if (!translations || Object.keys(translations).length === 0) return fallback || key;
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    return typeof value === 'string' ? value : (fallback || key);
  };

  const activeDbLang = dbLanguages.find(l => l.code === language);
  const dir = activeDbLang?.direction || (language === 'fa' || language === 'ar' ? 'rtl' : 'ltr');
  
  const activeAdminDbLang = dbLanguages.find(l => l.code === adminLanguage);
  const adminDir = activeAdminDbLang?.direction || (adminLanguage === 'fa' || adminLanguage === 'ar' ? 'rtl' : 'ltr');

  const availableLanguages = dbLanguages.length > 0 
    ? dbLanguages.filter(l => l.isActive).map(l => ({ code: l.code, name: l.name }))
    : [
        { code: 'en', name: 'English' },
        { code: 'fa', name: 'فارسی' },
        { code: 'tr', name: 'Türkçe' },
        { code: 'ar', name: 'العربية' },
      ];

  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      adminLanguage, 
      setLanguage, 
      setAdminLanguage, 
      t, 
      languages: availableLanguages, 
      dir,
      adminDir
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

function applyLanguageToDOM(lang: string) {
  // In a real app we might want to check the DB language direction here too
  const isRtl = lang === 'fa' || lang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
}
