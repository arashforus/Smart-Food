import { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import fa from '@/locales/fa.json';
import tr from '@/locales/tr.json';
import ar from '@/locales/ar.json';

type Language = 'en' | 'fa' | 'tr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  languages: { code: Language; name: string }[];
  dir: 'ltr' | 'rtl';
}

const translations = {
  en,
  fa,
  tr,
  ar,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load language from localStorage or fetch from API
    const loadLanguage = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const user = await response.json();
          const userLang = (user.language || 'en') as Language;
          setLanguageState(userLang);
          localStorage.setItem('language', userLang);
          applyLanguageToDOM(userLang);
        } else {
          // If not authenticated, use localStorage or default
          const stored = (localStorage.getItem('language') || 'en') as Language;
          setLanguageState(stored);
          applyLanguageToDOM(stored);
        }
      } catch (error) {
        console.error('Failed to load language:', error);
        const stored = (localStorage.getItem('language') || 'en') as Language;
        setLanguageState(stored);
        applyLanguageToDOM(stored);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    applyLanguageToDOM(lang);

    // Update user language preference in database
    try {
      await fetch('/api/auth/update-language', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang }),
      });
    } catch (error) {
      console.error('Failed to update language preference:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const dir = language === 'fa' || language === 'ar' ? 'rtl' : 'ltr';

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'fa', name: 'فارسی' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ar', name: 'العربية' },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages, dir }}>
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

function applyLanguageToDOM(lang: 'en' | 'fa' | 'tr' | 'ar') {
  const dir = lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
}
