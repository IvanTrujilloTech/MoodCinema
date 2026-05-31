"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface AppContextType {
  username: string;
  setUsername: (username: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsernameState] = useState('');
  const [language, setLanguageState] = useState<Language>('es-ES');
  const [theme, setThemeState] = useState('marquee');

  useEffect(() => {
    const savedUser = localStorage.getItem('moodfi_username');
    const savedLang = localStorage.getItem('moodfi_lang');
    
    if (savedUser) setUsernameState(savedUser);
    
    if (savedLang) {
      if (['es-ES', 'en-US', 'ca-ES'].includes(savedLang)) {
        setLanguageState(savedLang as Language);
      } else if (savedLang === 'es' || savedLang === 'ca' || savedLang === 'en') {
        const mapping: Record<string, Language> = {
          es: 'es-ES',
          en: 'en-US',
          ca: 'ca-ES'
        };
        const mapped = mapping[savedLang];
        setLanguageState(mapped);
        localStorage.setItem('moodfi_lang', mapped);
      } else {
        setLanguageState('es-ES');
        localStorage.setItem('moodfi_lang', 'es-ES');
      }
    }
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
  };

  const setUsername = (user: string) => {
    setUsernameState(user);
    localStorage.setItem('moodfi_username', user);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('moodfi_lang', lang);
  };

  return (
    <AppContext.Provider value={{ username, setUsername, language, setLanguage, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
