import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language, type Translations } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'pt-BR',
  setLanguage: () => {},
  t: (key) => translations['pt-BR'][key] || String(key),
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nanostat_language') as Language;
    return saved && translations[saved] ? saved : 'pt-BR';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nanostat_language', lang);
    window.dispatchEvent(new CustomEvent('nanostat-language-changed', { detail: lang }));
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nanostat_language' && e.newValue && translations[e.newValue as Language]) {
        setLanguageState(e.newValue as Language);
      }
    };
    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      if (customEvent.detail && translations[customEvent.detail]) {
        setLanguageState(customEvent.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('nanostat-language-changed', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('nanostat-language-changed', handleCustom);
    };
  }, []);

  const t = (key: keyof Translations): string => {
    return translations[language]?.[key] || translations['pt-BR'][key] || String(key);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
