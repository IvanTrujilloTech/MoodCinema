"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Dice5, User, CloudRain, Zap, Laugh, Ghost, Heart, Compass, Coffee, Shuffle, Film, ShieldAlert, Monitor, Sparkles } from 'lucide-react';

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
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useAppContext } from '@/context/AppContext';
import { Movie } from '@/types';
import { MOODS } from '@/lib/moods';

import MovieCard from '@/components/MovieCard';
import ExportButton from '@/components/ExportButton';
import TrailerModal from '@/components/TrailerModal';
import MovieDetailsModal from '@/components/MovieDetailsModal';

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { username, language, theme, setTheme } = useAppContext();
  const langKey = (language && typeof language === 'string' && language.includes('-'))
    ? (language.split('-')[0] as 'es' | 'en' | 'ca')
    : 'es';
  
  const moodId = searchParams.get('mood');
  const actorQuery = searchParams.get('actor');
  
  const isChaos = moodId === 'chaos';
  const mood = moodId ? (MOODS.find(m => m.id === moodId) || MOODS[MOODS.length - 1]) : null;

  // Determine and set appropriate theme dynamically
  useEffect(() => {
    if (actorQuery) {
      setTheme('marquee'); // Default theater look for actor searches
    } else if (moodId) {
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
    } else {
      setTheme('marquee');
    }
  }, [moodId, actorQuery, setTheme]);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Modals state
  const [activeTrailerId, setActiveTrailerId] = useState<number | null>(null);
  const [activeDetailsId, setActiveDetailsId] = useState<number | null>(null);

  // For slot machine effect
  const [isSpinning, setIsSpinning] = useState(false);

  // Actor search header state
  const [resolvedActorName, setResolvedActorName] = useState<string | null>(null);

  // Blinking clock state for VHS tracking widget
  const [vhsTime, setVhsTime] = useState("00:00:00");
  useEffect(() => {
    if (theme === 'horror' || theme === 'chaos') {
      const interval = setInterval(() => {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        setVhsTime(`${hrs}:${mins}:${secs}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [theme]);

  const fetchRecommendations = async (pageNum: number = 1, append: boolean = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    
    setError(null);
    try {
      if (actorQuery) {
        const res = await api.searchActorMovies(actorQuery, username, language, pageNum);
        if (res.data.length === 0 && !append) {
          setError(res.message || "No se encontraron películas para este actor.");
        } else {
          setMovies(prev => append ? [...prev, ...res.data] : res.data);
          setResolvedActorName(res.actor.name);
          setHasMore(pageNum < res.total_pages);
        }
      } else if (isChaos) {
        setIsSpinning(true);
        // Simulate vintage CRT slot machine spin delay
        await new Promise(r => setTimeout(r, 2200));
        const res = await api.getRoulette(language);
        setMovies([res.data]);
        setHasMore(false);
        setIsSpinning(false);
      } else if (moodId) {
        const res = await api.getRecommendations(moodId, username, language, pageNum);
        if (res.data.length === 0 && !append) {
          setError(res.message || "No se encontraron películas. Prueba con otro estado de ánimo.");
        } else {
          setMovies(prev => append ? [...prev, ...res.data] : res.data);
          if (moodId === 'comfort') {
            setHasMore(false);
          } else {
            setHasMore(res.data.length >= 10);
          }
        }
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al buscar recomendaciones.");
      setIsSpinning(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchRecommendations(1, false);
  }, [moodId, actorQuery, language]); 

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecommendations(nextPage, true);
  };

  const handleActorClick = (actorId: number, actorName: string) => {
    router.push(`/results?actor=${encodeURIComponent(actorName)}`);
  };

  // Determine back button style depending on active theme
  const getBackBtnClass = () => {
    if (theme === 'comedy') {
      return "neobrutalism-btn px-4 py-2 text-xs flex items-center gap-1.5";
    }
    if (theme === 'scifi') {
      return "border border-green-500 text-green-500 font-crt text-sm px-4 py-1.5 flex items-center gap-1.5 hover:bg-green-500/10";
    }
    if (theme === 'horror' || theme === 'drama' || theme === 'chaos') {
      return "cassette-eject-btn px-4 py-2 rounded flex items-center gap-1.5 text-xs";
    }
    return "flex items-center gap-2 text-[#f5a623] hover:text-[#ffd700] transition-colors font-typewriter text-sm";
  };

  // Spinner styled appropriately for the selected retro theme
  const renderSpinner = () => {
    if (theme === 'scifi') {
      return (
        <div className="text-center font-crt text-green-500 py-16">
          <p className="animate-pulse mb-2">&gt;&gt; CONECTANDO CON BASE DE DATOS TMDB...</p>
          <div className="w-64 h-2 bg-stone-900 border border-green-500 mx-auto overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-green-500 animate-[scanline_2s_linear_infinite]" />
          </div>
        </div>
      );
    }
    if (theme === 'horror') {
      return (
        <div className="flex flex-col items-center py-20">
          <Film className="text-[#e63946] animate-spin-slow h-12 w-12 mb-4" />
          <p className="font-crt text-[#e63946] tracking-widest animate-pulse text-sm">
            [REBOBINANDO VIDEOCASETE VHS...]
          </p>
        </div>
      );
    }
    if (theme === 'comedy') {
      return (
        <div className="flex flex-col items-center py-20">
          <div className="w-12 h-12 border-4 border-stone-900 border-t-pink-500 rounded-full animate-spin" />
          <p className="font-bold text-stone-900 mt-4 text-sm font-heading">
            Cargando risas...
          </p>
        </div>
      );
    }
    // Default spinner
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        {isSpinning ? (
          <div className="text-center flex flex-col items-center justify-center">
            <Shuffle size={54} className="text-[#f5a623] animate-spin-slow mb-4" />
            <p className="text-xl text-[#f5a623] font-typewriter animate-pulse">
              La ruleta está girando...
            </p>
          </div>
        ) : (
          <div className="w-12 h-12 border-4 border-stone-800 border-t-[#f5a623] rounded-full animate-spin" />
        )}
      </div>
    );
  };

  return (
    <main className={`theme-${theme} relative min-h-screen py-8 px-4 sm:px-6 lg:px-8`}>
      {/* 90s Visual overlays */}
      <div className="crt-scanlines" />
      <div className="film-grain" />
      <div className="cinema-vignette" />

      {/* VHS overlay elements for specific themes */}
      {theme === 'horror' && (
        <div className="absolute top-6 left-6 z-20 font-crt text-[#39ff14] text-xs flex flex-col gap-1 tracking-wider opacity-85 select-none pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
            <span className="font-bold text-red-500">PLAY [REC]</span>
          </div>
          <div>VCR HI-FI STEREO</div>
          <div>TRACKING AUDIO OK</div>
          <div className="mt-1">{vhsTime}</div>
        </div>
      )}

      {theme === 'chaos' && (
        <div className="absolute top-6 right-6 z-20 font-crt text-fuchsia-400 text-xs flex flex-col items-end gap-1 tracking-wider opacity-85 select-none pointer-events-none">
          <div>SLOT_RND_SYS_V2.0</div>
          <div>MODE: PSYCHEDELIC ROULETTE</div>
          <div className="text-[10px] text-fuchsia-500 animate-pulse">{vhsTime}</div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-stone-900/60 pb-6">
          <button 
            onClick={() => router.push('/')}
            className={getBackBtnClass()}
          >
            <ArrowLeft size={16} />
            <span>{theme === 'horror' || theme === 'chaos' || theme === 'drama' ? 'EJECT / VOLVER' : theme === 'scifi' ? 'CD..' : 'Volver al inicio'}</span>
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {!isChaos && movies.length > 0 && (
              <ExportButton movies={movies} />
            )}
            
            {isChaos && (
              <button 
                onClick={() => fetchRecommendations(1, false)}
                disabled={isSpinning || loading}
                className={theme === 'comedy' ? 'neobrutalism-btn px-6 py-2.5 flex items-center gap-2 text-sm' : "flex items-center gap-2 px-5 py-2.5 bg-[#f5a623] text-black font-crt font-bold tracking-wider hover:bg-amber-400 active:scale-95 duration-100 disabled:opacity-50"}
              >
                <Dice5 size={18} className={isSpinning ? "animate-spin-slow" : ""} />
                Girar de nuevo
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Theme Header Area */}
        <div className="text-center mb-12">
          {actorQuery ? (
             <>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block p-4 rounded-full bg-gradient-to-br from-stone-800 to-stone-950 mb-4 shadow-[0_0_30px_rgba(245,166,35,0.15)] border border-[#f5a623]/30"
              >
                <User size={36} className="text-[#f5a623]" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-typewriter font-bold mb-2 text-stone-100">
                Maratón de {resolvedActorName || actorQuery}
              </h1>
             </>
          ) : mood ? (
            <>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`inline-block p-4 rounded-full bg-stone-950 border border-stone-800 mb-4`}
              >
                {(() => {
                  const Icon = IconMap[mood.icon as keyof typeof IconMap];
                  return Icon ? <Icon size={36} className={theme === 'horror' ? 'text-[#e63946]' : theme === 'scifi' ? 'text-[#39ff14]' : theme === 'comedy' ? 'text-pink-600' : 'text-[#f5a623]'} /> : null;
                })()}
              </motion.div>
              
              {theme === 'scifi' ? (
                <h1 className="text-3xl md:text-4xl font-crt font-bold tracking-widest uppercase text-green-500">
                  {"// BUSCANDO: "}{mood.label[langKey]?.toUpperCase() || mood.label.en.toUpperCase()}
                </h1>
              ) : theme === 'horror' ? (
                <h1 className="text-3xl md:text-4xl font-crt font-extrabold tracking-wider uppercase text-[#e63946] horror-blood-drip max-w-lg mx-auto pb-2">
                  Sesión Maldita: {mood.label[langKey] || mood.label.en}
                </h1>
              ) : theme === 'comedy' ? (
                <h1 className="text-4xl font-heading font-extrabold tracking-tight text-stone-900 uppercase">
                  ⚡ ¡DIVERSIÓN ASEGURADA!: {mood.label[langKey] || mood.label.en}
                </h1>
              ) : (
                <h1 className="text-3xl md:text-4xl font-typewriter font-bold mb-2 text-stone-100">
                  {mood.label[langKey] || mood.label.en}
                </h1>
              )}
            </>
          ) : null}

          {username && !isChaos && (
            <div className="mt-4 flex items-center justify-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${theme === 'scifi' ? 'bg-[#39ff14]' : theme === 'horror' ? 'bg-[#e63946]' : 'bg-[#f5a623]'}`} />
              <p className={`text-xs ${theme === 'scifi' ? 'text-green-600 font-crt' : theme === 'horror' ? 'text-[#e63946] font-crt' : theme === 'comedy' ? 'text-stone-700 font-sans font-bold' : 'text-[#f5a623] font-typewriter'}`}>
                Filtro activado para: @{username} (No repetiremos tus vistas)
              </p>
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          renderSpinner()
        ) : error ? (
          <div className={`p-8 text-center max-w-2xl mx-auto border ${theme === 'comedy' ? 'neobrutalism-card bg-red-100 border-stone-900' : theme === 'scifi' ? 'terminal-box text-green-500' : 'glass-panel border-red-900/50'}`}>
            {theme === 'scifi' ? <ShieldAlert size={40} className="mx-auto mb-4" /> : null}
            <h2 className={`text-xl font-bold mb-2 ${theme === 'comedy' ? 'text-stone-900 font-heading' : theme === 'scifi' ? 'text-green-500 font-crt' : 'text-red-500'}`}>
              {theme === 'scifi' ? 'SYSTEM_ERROR_0x9A3:' : 'Ups, algo salió mal'}
            </h2>
            <p className={`mb-6 text-sm ${theme === 'comedy' ? 'text-stone-800' : theme === 'scifi' ? 'text-green-500 font-crt' : 'text-stone-300'}`}>{error}</p>
            <button 
              onClick={() => router.push('/')}
              className={theme === 'comedy' ? 'neobrutalism-btn px-6 py-2' : theme === 'scifi' ? 'border border-green-500 px-4 py-2 hover:bg-green-500/10' : "px-6 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 transition-colors text-xs font-typewriter"}
            >
              Volver a intentar
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            
            {/* Slot machine styling around roulette chaos page */}
            {isChaos && (
              <div className={`w-full max-w-md mx-auto mb-6 p-4 text-center rounded ${theme === 'comedy' ? 'neobrutalism-card' : theme === 'scifi' ? 'terminal-box' : 'marquee-panel border-4 border-[#f5a623]'}`}>
                <div className="text-[10px] font-crt text-stone-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                  <Monitor size={10} className="animate-pulse" />
                  <span>CINTA RETRO INDEPENDIENTE SELECCIONADA</span>
                </div>
                <div className="h-1 bg-stone-950 border-t border-b border-stone-800/80 mb-3" />
              </div>
            )}

            <div className={`grid gap-6 w-full ${isChaos ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'}`}>
              <AnimatePresence>
                {movies.map((movie, idx) => (
                  <MovieCard 
                    key={movie.id + '-' + idx} 
                    movie={movie} 
                    index={idx}
                    onPlayTrailer={(id) => setActiveTrailerId(id)}
                    onShowDetails={(id) => setActiveDetailsId(id)}
                  />
                ))}
              </AnimatePresence>
            </div>
            
            {hasMore && !isChaos && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`mt-12 px-8 py-3.5 transition-all disabled:opacity-50 flex items-center gap-2 text-sm ${theme === 'comedy' ? 'neobrutalism-btn' : theme === 'scifi' ? 'border border-green-500 text-green-500 font-crt hover:bg-green-500/10' : 'bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 font-typewriter text-stone-300'}`}
              >
                {loadingMore && <div className={`w-4 h-4 border-2 rounded-full animate-spin ${theme === 'scifi' ? 'border-green-500/20 border-t-green-500' : 'border-stone-700 border-t-stone-200'}`} />}
                {loadingMore ? 'Cargando película...' : 'Cargar más películas'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal 
        movieId={activeTrailerId!} 
        isOpen={activeTrailerId !== null} 
        onClose={() => setActiveTrailerId(null)} 
      />

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movieId={activeDetailsId}
        isOpen={activeDetailsId !== null}
        onClose={() => setActiveDetailsId(null)}
        onActorClick={handleActorClick}
        onPlayTrailer={(id) => {
          setActiveDetailsId(null);
          setActiveTrailerId(id);
        }}
      />

    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-8 px-4 flex items-center justify-center bg-[#060609]">
        <div className="w-12 h-12 border-4 border-stone-800 border-t-[#f5a623] rounded-full animate-spin" />
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}
