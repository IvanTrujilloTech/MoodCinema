"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Dice5, User, CloudRain, Zap, Laugh, Ghost, Heart, Compass, Coffee, Shuffle } from 'lucide-react';

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
  const { username, language } = useAppContext();
  const langKey = (language && typeof language === 'string' && language.includes('-'))
    ? (language.split('-')[0] as 'es' | 'en' | 'ca')
    : 'es';
  
  const moodId = searchParams.get('mood');
  const actorQuery = searchParams.get('actor');
  
  const isChaos = moodId === 'chaos';
  const mood = moodId ? (MOODS.find(m => m.id === moodId) || MOODS[MOODS.length - 1]) : null;

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

  const fetchRecommendations = async (pageNum: number = 1, append: boolean = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    
    setError(null);
    try {
      if (actorQuery) {
        // Fetch actor mode
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
        // Simulate slot machine spin time
        await new Promise(r => setTimeout(r, 2000));
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
  }, [moodId, actorQuery, language]); // Re-fetch if language changes

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecommendations(nextPage, true);
  };

  const handleActorClick = (actorId: number, actorName: string) => {
    // Navigate to actor search
    router.push(`/results?actor=${encodeURIComponent(actorName)}`);
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </button>
        
        {!isChaos && movies.length > 0 && (
          <ExportButton movies={movies} />
        )}
        
        {isChaos && (
          <button 
            onClick={() => fetchRecommendations(1, false)}
            disabled={isSpinning || loading}
            className="flex items-center gap-2 px-6 py-2 bg-cinema-accent text-black font-bold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            <Dice5 size={20} className={isSpinning ? "animate-spin-slow" : ""} />
            Girar de nuevo
          </button>
        )}
      </div>

      {/* Header Area */}
      <div className="text-center mb-12">
        {actorQuery ? (
           <>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block p-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-800 mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <User size={40} className="text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Maratón de {resolvedActorName || actorQuery}
            </h1>
           </>
        ) : mood ? (
          <>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`inline-block p-4 rounded-full bg-gradient-to-br ${mood.color} mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
            >
              {(() => {
                const Icon = IconMap[mood.icon as keyof typeof IconMap];
                return Icon ? <Icon size={40} className="text-white" /> : null;
              })()}
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              {mood.label[langKey] || mood.label.en}
            </h1>
          </>
        ) : null}

        {username && !isChaos && (
          <p className="text-cinema-accent text-sm">
            Filtro activado para: @{username} (No repetiremos lo que ya viste)
          </p>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          {isSpinning ? (
            <div className="text-center flex flex-col items-center justify-center">
              <Shuffle size={54} className="text-cinema-accent animate-spin-slow mb-4" />
              <p className="text-xl text-cinema-accent font-heading animate-pulse">
                La ruleta está girando...
              </p>
            </div>
          ) : (
             <div className="w-12 h-12 border-4 border-cinema-border border-t-cinema-accent rounded-full animate-spin" />
          )}
        </div>
      ) : error ? (
        <div className="glass-panel p-8 text-center max-w-2xl mx-auto border-cinema-danger/50">
          <h2 className="text-xl font-bold text-cinema-danger mb-2">Ups, algo salió mal</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Volver a intentar
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
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
              className="mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 border border-cinema-border rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loadingMore && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {loadingMore ? 'Cargando...' : 'Cargar más películas'}
            </button>
          )}
        </div>
      )}

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
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cinema-border border-t-cinema-accent rounded-full animate-spin" />
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}
