"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { MOODS } from '@/lib/moods';
import { useAppContext } from '@/context/AppContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const router = useRouter();
  const { username, setUsername, language } = useAppContext();
  const [localUser, setLocalUser] = useState(username);
  const [actorSearch, setActorSearch] = useState('');

  const handleMoodSelect = (moodId: string) => {
    // Save username locally (even if empty to allow clearing)
    setUsername(localUser);
    router.push(`/results?mood=${moodId}`);
  };

  const handleActorSearch = () => {
    setUsername(localUser);
    if (actorSearch.trim()) {
      router.push(`/results?actor=${encodeURIComponent(actorSearch.trim())}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Mood<span className="text-cinema-accent">-Fi</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Cine Edition</p>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center space-y-12">
        
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
            ¿Cómo te sientes <span className="text-gradient">hoy</span>?
          </h2>
          <p className="text-gray-400 text-lg">
            Sincroniza con Letterboxd y descubre qué ver. Sin repetir lo que ya has visto.
          </p>
        </div>

        {/* Inputs Container */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Letterboxd Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-cinema-border rounded-2xl focus:ring-2 focus:ring-cinema-accent focus:border-transparent transition-all placeholder-gray-500 text-white"
              placeholder="Tu Letterboxd (opcional)"
              value={localUser}
              onChange={(e) => setLocalUser(e.target.value)}
            />
          </div>

          {/* Actor Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-xl">🎭</span>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-16 py-4 bg-white/5 border border-cinema-border rounded-2xl focus:ring-2 focus:ring-cinema-accent focus:border-transparent transition-all placeholder-gray-500 text-white"
              placeholder="Filtro de Actor (Ej: Adam Sandler)"
              value={actorSearch}
              onChange={(e) => setActorSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleActorSearch()}
            />
            <button
              onClick={handleActorSearch}
              className="absolute inset-y-2 right-2 px-4 bg-cinema-accent hover:bg-amber-400 text-black font-bold rounded-xl transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Mood Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {MOODS.map((mood) => (
            <motion.button
              key={mood.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMoodSelect(mood.id)}
              className="glass-panel p-6 text-left relative overflow-hidden group h-full flex flex-col justify-between min-h-[160px]"
            >
              {/* Background gradient effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <span className="text-4xl mb-4 block">{mood.icon}</span>
                <h3 className="font-heading font-semibold text-xl mb-1 group-hover:text-cinema-accent transition-colors">
                  {mood.label[language.split('-')[0] as 'es' | 'en' | 'ca'] || mood.label.en}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {mood.description[language.split('-')[0] as 'es' | 'en' | 'ca'] || mood.description.en}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
