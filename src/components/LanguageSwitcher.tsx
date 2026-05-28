"use client";

import { useAppContext } from '@/context/AppContext';
import { Language } from '@/types';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CatalanFlag = () => (
  <svg width="16" height="12" viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1 rounded-sm shadow-sm border border-black/20">
    <rect width="9" height="6" fill="#fcd116"/>
    <rect width="9" height="1" y="0.5" fill="#ce1126"/>
    <rect width="9" height="1" y="2" fill="#ce1126"/>
    <rect width="9" height="1" y="3.5" fill="#ce1126"/>
    <rect width="9" height="1" y="5" fill="#ce1126"/>
  </svg>
);

const languages = [
  { code: 'es-ES', label: '🇪🇸 ES' },
  { code: 'en-US', label: '🇺🇸 EN' },
  { code: 'ca-ES', label: <><CatalanFlag /> CA</> }
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full glass-panel hover:bg-white/5 transition-colors"
      >
        <Globe size={16} className="text-cinema-accent" />
        <span className="text-sm font-medium">{languages.find(l => l.code === language)?.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 p-1 glass-panel flex flex-col gap-1 min-w-[120px] z-50"
          >
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as Language);
                  setIsOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  language === lang.code ? 'bg-cinema-accent/20 text-cinema-accent' : 'hover:bg-white/5'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
