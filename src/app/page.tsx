"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Clapperboard, CloudRain, Zap, Laugh, Ghost, Heart, Compass, Coffee, Shuffle, Film, Star } from 'lucide-react';
import { MOODS } from '@/lib/moods';
import { useAppContext } from '@/context/AppContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const IconMap = {
  CloudRain,
  Zap,
  Laugh,
  Ghost,
  Heart,
  Compass,
  Coffee,
  Shuffle
};

// Theme visual styles map for previewing on cards
const MoodCardStyles: Record<string, { cardClass: string; textClass: string; iconClass: string }> = {
  cry: {
    cardClass: "bg-slate-900/60 border border-slate-700/50 hover:border-slate-400 font-typewriter",
    textClass: "text-slate-300 font-semibold",
    iconClass: "text-slate-400"
  },
  adrenaline: {
    cardClass: "bg-black/60 border border-orange-600/50 hover:border-[#ff5e00] font-crt",
    textClass: "text-orange-500 font-semibold tracking-wider uppercase",
    iconClass: "text-[#ff5e00] animate-pulse"
  },
  braindead: {
    cardClass: "bg-pink-100 hover:bg-pink-50 border-3 border-stone-900 shadow-[4px_4px_0px_#1c1917] rounded-none hover:scale-[1.02] active:scale-[0.98] transition-transform duration-100 text-stone-900 font-sans",
    textClass: "text-stone-900 font-extrabold font-heading",
    iconClass: "text-pink-600"
  },
  psycho: {
    cardClass: "bg-stone-950/90 border border-emerald-500/40 hover:border-[#39ff14] hover:shadow-[0_0_10px_rgba(57,255,20,0.2)] font-crt",
    textClass: "text-emerald-400 font-bold tracking-widest",
    iconClass: "text-[#39ff14] animate-flicker"
  },
  romance: {
    cardClass: "bg-purple-950/40 border border-rose-500/40 hover:border-rose-400 hover:shadow-[0_0_12px_rgba(244,63,94,0.3)] font-heading",
    textClass: "text-rose-400 font-semibold italic",
    iconClass: "text-rose-500"
  },
  adventure: {
    cardClass: "bg-stone-950 border border-green-500/50 hover:border-green-400 font-crt hover:shadow-[0_0_8px_rgba(57,255,20,0.15)]",
    textClass: "text-green-500 font-bold",
    iconClass: "text-green-500"
  },
  comfort: {
    cardClass: "bg-[#251b14] border border-[#e5a93b]/50 hover:border-[#e5a93b] font-typewriter",
    textClass: "text-[#e5a93b] font-semibold",
    iconClass: "text-[#e5a93b]"
  },
  chaos: {
    cardClass: "bg-stone-950/80 border border-fuchsia-600/50 hover:border-fuchsia-400 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] font-crt",
    textClass: "text-fuchsia-500 font-semibold uppercase animate-pulse",
    iconClass: "text-fuchsia-500"
  }
};

export default function Home() {
  const router = useRouter();
  const { username, setUsername, language, setTheme } = useAppContext();
  const langKey = (language && typeof language === 'string' && language.includes('-'))
    ? (language.split('-')[0] as 'es' | 'en' | 'ca')
    : 'es';
  const [localUser, setLocalUser] = useState(username);
  const [actorSearch, setActorSearch] = useState('');

  // Reset to default marquee lobby theme on mount
  useEffect(() => {
    setTheme('marquee');
  }, [setTheme]);

  const handleMoodSelect = (moodId: string) => {
    setUsername(localUser);
    // Map moodId to our theme context
    const themeMapping: Record<string, string> = {
      cry: 'drama',
      adrenaline: 'action',
      braindead: 'comedy',
      psycho: 'horror',
      romance: 'romance',
      adventure: 'scifi',
      comfort: 'comfort',
      chaos: 'chaos'
    };
    setTheme(themeMapping[moodId] || 'marquee');
    router.push(`/results?mood=${moodId}`);
  };

  const handleActorSearch = () => {
    setUsername(localUser);
    setTheme('marquee'); // Actor search uses the default marquee theater aesthetic
    if (actorSearch.trim()) {
      router.push(`/results?actor=${encodeURIComponent(actorSearch.trim())}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  } as const;

  return (
    <main className="theme-marquee relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between flex-grow w-full">
      
      {/* 90s Vintage Screen Overlays */}
      <div className="crt-scanlines" />
      <div className="film-grain" />
      <div className="cinema-vignette" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Film className="text-[#f5a623] h-5 w-5 animate-pulse" />
          <span className="text-xs font-crt text-stone-500 tracking-widest uppercase">
            VHS HI-FI PLAY
          </span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-10 flex-grow max-w-5xl mx-auto w-full my-auto">
        
        {/* Neon Cinema Marquee Title */}
        <div className="marquee-panel px-10 py-8 rounded-xl max-w-2xl w-full mx-auto relative overflow-hidden">
          {/* Bulb Lights Top Border */}
          <div className="absolute top-1.5 inset-x-0 flex justify-between px-6 animate-marquee-blink">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="marquee-light-bulb" />
            ))}
          </div>

          <h1 className="text-5xl md:text-6xl font-typewriter font-bold tracking-tight text-[#f5a623] neon-glow-gold animate-flicker">
            Mood<span className="text-[#e63946] neon-glow-red font-bold">Cinema</span>
          </h1>

          <div className="text-xs text-stone-400 font-crt mt-3 tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Star size={10} className="text-[#f5a623] animate-pulse" />
            <span>Elige tu humor • Consigue una película</span>
            <Star size={10} className="text-[#f5a623] animate-pulse" />
          </div>

          {/* Bulb Lights Bottom Border */}
          <div className="absolute bottom-1.5 inset-x-0 flex justify-between px-6 animate-marquee-blink">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="marquee-light-bulb" style={{ animationDelay: '0.5s' }} />
            ))}
          </div>
        </div>

        <div className="space-y-3 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-typewriter font-semibold text-stone-200">
            ¿Cómo te sientes <span className="text-[#f5a623] italic underline decoration-[#e63946] decoration-2">hoy</span>?
          </h2>
          <p className="text-stone-400 text-sm font-typewriter max-w-md mx-auto leading-relaxed">
            Sincroniza tu Letterboxd y te recomendaremos el film perfecto. Sin repetir lo que ya has visto.
          </p>
        </div>

        {/* 90s Ticket Booth Search Area */}
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-6 items-stretch justify-center relative">
          
          {/* Ticket 1: Letterboxd */}
          <div className="ticket-stub flex-1 bg-[#25181b] border-2 border-[#f5a623]/80 p-5 flex flex-col justify-between relative shadow-2xl min-h-[140px] text-left">
            <div className="absolute top-0 right-4 text-[9px] font-crt text-stone-500 select-none">
              TICKET ADMIT ONE
            </div>
            
            <div>
              <label className="block text-xs font-crt text-[#f5a623] tracking-widest uppercase mb-1.5">
                Taquilla Letterboxd
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-2.5 bg-black/40 border border-stone-800 focus:outline-none focus:border-[#f5a623] transition-colors placeholder-stone-600 text-xs font-typewriter text-white"
                  placeholder="Tu usuario (opcional)"
                  value={localUser}
                  onChange={(e) => setLocalUser(e.target.value)}
                />
              </div>
            </div>
            <div className="border-t border-dashed border-[#f5a623]/40 mt-3 pt-2 text-[9px] font-typewriter text-stone-500">
              * EVITA REPETIR TUS PELÍCULAS VISTAS
            </div>
          </div>

          {/* Ticket 2: Actor Search */}
          <div className="ticket-stub flex-1 bg-[#1a2524] border-2 border-emerald-500/80 p-5 flex flex-col justify-between relative shadow-2xl min-h-[140px] text-left">
            <div className="absolute top-0 right-4 text-[9px] font-crt text-stone-500 select-none">
              MOVIE PASS
            </div>

            <div>
              <label className="block text-xs font-crt text-emerald-400 tracking-widest uppercase mb-1.5">
                Búsqueda por Reparto
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Clapperboard className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
                  <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2.5 bg-black/40 border border-stone-800 focus:outline-none focus:border-emerald-500 transition-colors placeholder-stone-600 text-xs font-typewriter text-white"
                    placeholder="Escribe un actor..."
                    value={actorSearch}
                    onChange={(e) => setActorSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleActorSearch()}
                  />
                </div>
                <button
                  onClick={handleActorSearch}
                  className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-crt text-xs tracking-wider uppercase border border-emerald-400 active:scale-95 duration-100 shrink-0"
                >
                  Buscar
                </button>
              </div>
            </div>
            <div className="border-t border-dashed border-emerald-500/40 mt-3 pt-2 text-[9px] font-typewriter text-stone-500">
              * MARATÓN EXCLUSIVO SIN FILMES VISTOS
            </div>
          </div>
        </div>

        {/* Mood Grid Redesign */}
        <div className="w-full space-y-4">
          <div className="text-xs font-crt text-stone-500 tracking-widest uppercase mb-2">
            — SELECCIONA EL GÉNERO / HUMOR DE TU SESIÓN —
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {MOODS.map((mood) => {
              const styles = MoodCardStyles[mood.id] || {
                cardClass: "bg-stone-900/60 border border-stone-800 hover:border-[#f5a623] font-sans",
                textClass: "text-white font-semibold",
                iconClass: "text-[#f5a623]"
              };
              
              const isNeobrutalist = mood.id === 'braindead';
              const Icon = IconMap[mood.icon as keyof typeof IconMap];

              return (
                <motion.button
                  key={mood.id}
                  variants={itemVariants}
                  whileHover={!isNeobrutalist ? { scale: 1.04, y: -4 } : {}}
                  whileTap={!isNeobrutalist ? { scale: 0.98 } : {}}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`p-5 text-left relative overflow-hidden group h-full flex flex-col justify-between min-h-[155px] ${styles.cardClass}`}
                >
                  {/* Subtle retro backdrop color tint */}
                  {!isNeobrutalist && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  )}
                  
                  <div className="relative z-10 w-full flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start mb-2">
                      {Icon && <Icon size={28} className={styles.iconClass} />}
                      <span className="text-[9px] opacity-35 font-crt tracking-widest">
                        90S_MED_CT
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className={`text-lg mb-1 leading-tight group-hover:scale-[1.01] transition-transform ${styles.textClass}`}>
                        {mood.label[langKey] || mood.label.en}
                      </h3>
                      <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed font-sans">
                        {mood.description[langKey] || mood.description.en}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
