"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface AppContextType {
  username: string;
  setUsername: (username: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsernameState] = useState('');
  const [language, setLanguageState] = useState<Language>('es-ES');

  useEffect(() => {
    const savedUser = localStorage.getItem('moodfi_username');
    const savedLang = localStorage.getItem('moodfi_lang') as Language;
    
    if (savedUser) setUsernameState(savedUser);
    if (savedLang) setLanguageState(savedLang);
  }, []);

  const setUsername = (user: string) => {
    setUsernameState(user);
    localStorage.setItem('moodfi_username', user);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('moodfi_lang', lang);
  };

  return (
    <AppContext.Provider value={{ username, setUsername, language, setLanguage }}>
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
