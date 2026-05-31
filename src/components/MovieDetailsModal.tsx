"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, Star, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAppContext } from '@/context/AppContext';

interface MovieDetailsModalProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onActorClick: (actorId: number, actorName: string) => void;
  onPlayTrailer: (id: number) => void;
}

export default function MovieDetailsModal({ movieId, isOpen, onClose, onActorClick, onPlayTrailer }: MovieDetailsModalProps) {
  const { language, theme } = useAppContext();
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movieId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const res = await api.getMovieDetails(movieId, language);
          if (res.success && res.data) {
            setDetails(res.data);
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, movieId, language]);

  if (!isOpen) return null;

  const langCode = language.split('-')[1] || 'ES'; 
  const providers = details?.['watch/providers']?.results?.[langCode] || details?.['watch/providers']?.results?.['US'];

  // Style helper based on active theme
  const getModalContainerClass = () => {
    const base = "relative w-full max-w-5xl max-h-[90vh] overflow-y-auto z-10 flex flex-col md:flex-row hide-scrollbar ";
    if (theme === 'comedy') {
      return base + "neobrutalism-card bg-white p-4";
    }
    if (theme === 'scifi') {
      return base + "terminal-box bg-black font-crt text-green-500 border-2 border-green-500";
    }
    if (theme === 'horror' || theme === 'chaos') {
      const stroke = theme === 'horror' ? 'border-[#e63946]' : 'border-fuchsia-500';
      return base + `bg-stone-950 border-2 ${stroke} font-crt text-stone-200`;
    }
    if (theme === 'romance' || theme === 'drama') {
      return base + "polaroid-frame bg-[#fcfcfc] text-stone-950 font-typewriter";
    }
    if (theme === 'comfort') {
      return base + "warm-vintage-card bg-[#281e17] border-2 border-[#e5a93b] text-stone-200 font-typewriter";
    }
    // Default Lobby
    return base + "ticket-stub bg-[#110e12] border-2 border-[#f5a623] text-stone-200";
  };

  const getCloseBtnClass = () => {
    if (theme === 'comedy') {
      return "absolute top-4 right-4 z-20 p-2 bg-stone-100 hover:bg-stone-200 border-2 border-stone-900 text-stone-900 rounded-none shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[0px_0px_0px_#000]";
    }
    if (theme === 'scifi') {
      return "absolute top-4 right-4 z-20 p-2 bg-black hover:bg-green-500/10 border border-green-500 text-green-500 rounded-none";
    }
    if (theme === 'horror' || theme === 'chaos') {
      const stroke = theme === 'horror' ? 'border-[#e63946]' : 'border-fuchsia-500';
      const text = theme === 'horror' ? 'text-[#e63946]' : 'text-fuchsia-400';
      return `absolute top-4 right-4 z-20 p-2 bg-black border ${stroke} ${text} hover:bg-white/5 rounded-none`;
    }
    return "absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-600 text-white rounded-full transition-colors";
  };

  const getTrailerBtnClass = () => {
    if (theme === 'comedy') {
      return "neobrutalism-btn px-6 py-3 text-sm flex items-center justify-center gap-2";
    }
    if (theme === 'scifi') {
      return "border border-green-500 bg-transparent text-green-500 hover:bg-green-500/10 px-6 py-3 font-crt uppercase tracking-wider text-sm flex items-center justify-center gap-2";
    }
    if (theme === 'horror' || theme === 'chaos') {
      const stroke = theme === 'horror' ? 'border-[#e63946]' : 'border-fuchsia-500';
      const text = theme === 'horror' ? 'text-[#e63946]' : 'text-fuchsia-400';
      return `border ${stroke} ${text} bg-transparent hover:bg-white/5 px-6 py-3 font-crt uppercase tracking-wider text-sm flex items-center justify-center gap-2`;
    }
    if (theme === 'comfort') {
      return "bg-transparent border border-[#e5a93b] hover:bg-[#e5a93b]/20 text-[#e5a93b] px-6 py-3 font-typewriter text-sm flex items-center justify-center gap-2";
    }
    return "bg-[#f5a623] hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors";
  };

  const getActorBtnClass = () => {
    if (theme === 'comedy') {
      return "neobrutalism-btn px-3 py-1.5 text-xs flex items-center gap-2";
    }
    if (theme === 'scifi') {
      return "px-3 py-1.5 border border-green-500/50 hover:border-green-500 text-green-500 bg-transparent hover:bg-green-500/5 text-xs transition-colors flex items-center gap-2";
    }
    if (theme === 'horror' || theme === 'chaos') {
      const stroke = theme === 'horror' ? 'border-[#e63946]/50 hover:border-[#e63946]' : 'border-fuchsia-500/50 hover:border-fuchsia-500';
      const text = theme === 'horror' ? 'text-[#e63946]' : 'text-fuchsia-400';
      return `px-3 py-1.5 border ${stroke} ${text} bg-transparent hover:bg-white/5 text-xs transition-colors flex items-center gap-2`;
    }
    if (theme === 'romance' || theme === 'drama') {
      return "px-3 py-1.5 border border-stone-300 hover:border-stone-500 text-stone-850 hover:bg-stone-50 text-xs transition-colors flex items-center gap-2";
    }
    if (theme === 'comfort') {
      return "px-3 py-1.5 border border-[#e5a93b]/40 hover:border-[#e5a93b] text-[#e5a93b] hover:bg-[#e5a93b]/10 text-xs transition-colors flex items-center gap-2";
    }
    return "px-3 py-1.5 bg-white/5 border border-stone-800 hover:border-[#f5a623] hover:bg-white/10 text-xs transition-colors flex items-center gap-2 rounded-lg";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className={getModalContainerClass()}
        >
          <button
            onClick={onClose}
            className={getCloseBtnClass()}
          >
            <X size={20} />
          </button>

          {isLoading || !details ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className={`w-8 h-8 border-2 rounded-full animate-spin ${theme === 'scifi' ? 'border-green-500 border-t-transparent' : theme === 'horror' ? 'border-[#e63946] border-t-transparent' : 'border-[#f5a623] border-t-transparent'}`} />
            </div>
          ) : (
            <>
              {/* Poster Section */}
              <div className="w-full md:w-1/3 relative shrink-0 min-h-[300px] md:min-h-[500px]">
                <Image 
                  src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                  alt={details.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`object-cover ${theme === 'scifi' ? 'grayscale opacity-75' : ''}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent md:hidden ${theme === 'comedy' ? 'from-white' : theme === 'scifi' ? 'from-black' : 'from-stone-950'}`} />
              </div>

              {/* Info Section */}
              <div className="w-full md:w-2/3 p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${theme === 'comedy' ? 'font-heading font-black text-stone-900' : theme === 'scifi' ? 'text-green-500 font-crt tracking-widest' : theme === 'horror' ? 'text-[#e63946]' : ''}`}>
                    {theme === 'scifi' || theme === 'horror' ? details.title.toUpperCase() : details.title}
                  </h2>
                  
                  {details.tagline && (
                    <p className={`italic mb-4 text-sm ${theme === 'comedy' ? 'text-stone-700' : theme === 'scifi' ? 'text-green-600' : theme === 'horror' ? 'text-stone-500' : 'text-[#f5a623]'}`}>
                      {details.tagline}
                    </p>
                  )}
                  
                  <div className={`flex flex-wrap items-center gap-4 text-xs ${theme === 'comedy' ? 'text-stone-700 font-bold' : theme === 'scifi' ? 'text-green-600' : 'text-stone-400'}`}>
                    <span className="flex items-center gap-1">
                      <Star size={14} className={theme === 'comedy' ? "text-pink-500 fill-pink-500" : theme === 'scifi' ? "text-green-500" : theme === 'horror' ? "text-[#e63946]" : "text-yellow-400 fill-yellow-400"} /> 
                      {details.vote_average?.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {details.release_date?.substring(0, 4)}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {details.runtime} min</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {details.genres?.map((g: any) => (
                    <span key={g.id} className={`px-3 py-1 text-xs rounded-full ${theme === 'comedy' ? 'bg-pink-100 border border-stone-900 text-stone-900 font-bold' : theme === 'scifi' ? 'border border-green-500/40 text-green-500 bg-transparent' : theme === 'horror' ? 'border border-[#e63946]/40 text-[#e63946] bg-transparent' : 'bg-white/10 text-stone-300'}`}>
                      {g.name}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${theme === 'comedy' ? 'font-heading font-black text-stone-900' : theme === 'scifi' ? 'text-green-500 font-crt uppercase' : ''}`}>
                    {theme === 'scifi' ? '&gt; SINOPSIS_DATA' : 'Sinopsis'}
                  </h3>
                  <p className={`leading-relaxed text-sm ${theme === 'comedy' ? 'text-stone-800' : theme === 'scifi' ? 'text-green-600 font-crt' : 'text-stone-300'}`}>
                    {details.overview || "No hay descripción disponible."}
                  </p>
                </div>

                {/* Cast */}
                <div>
                  <h3 className={`text-lg font-bold mb-3 ${theme === 'comedy' ? 'font-heading font-black text-stone-900' : theme === 'scifi' ? 'text-green-500 font-crt uppercase' : ''}`}>
                    {theme === 'scifi' ? '&gt; CAST_RECORDS' : 'Reparto Principal'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {details.credits?.cast?.slice(0, 8).map((actor: any) => (
                      <button 
                        key={actor.id}
                        onClick={() => {
                          onClose();
                          onActorClick(actor.id, actor.name);
                        }}
                        className={getActorBtnClass()}
                      >
                        {actor.profile_path && (
                          <div className="w-5 h-5 relative shrink-0">
                            <Image 
                              src={`https://image.tmdb.org/t/p/w45${actor.profile_path}`} 
                              alt={actor.name} 
                              fill
                              sizes="20px"
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}
                        <span>{actor.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className={`text-[10px] mt-2 flex items-center gap-1 ${theme === 'comedy' ? 'text-stone-600 font-bold' : theme === 'scifi' ? 'text-green-700' : 'text-stone-500'}`}>
                    <Sparkles size={11} className={theme === 'scifi' ? 'text-green-500 animate-pulse' : 'text-[#f5a623] animate-pulse'} />
                    <span>Haz clic en un actor para buscar sus películas no vistas.</span>
                  </p>
                </div>

                {/* Watch Providers & Trailer */}
                <div className={`mt-auto pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${theme === 'comedy' ? 'border-stone-900' : theme === 'scifi' ? 'border-green-500/40' : theme === 'horror' ? 'border-[#e63946]/40' : 'border-stone-850'}`}>
                  
                  {/* Providers */}
                  <div>
                    {providers && (providers.flatrate || providers.rent || providers.buy) ? (
                      <div>
                        <span className={`text-[11px] mb-2 block ${theme === 'comedy' ? 'text-stone-700 font-bold' : 'text-stone-400'}`}>Dónde ver (España):</span>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set([...(providers.flatrate || []), ...(providers.rent || []), ...(providers.buy || [])].map(p => p.provider_id)))
                            .slice(0, 5)
                            .map(id => {
                              const p = [...(providers.flatrate || []), ...(providers.rent || []), ...(providers.buy || [])].find(p => p.provider_id === id);
                              return (
                                <div key={p.provider_id} className={`w-9 h-9 relative rounded overflow-hidden border ${theme === 'comedy' ? 'border-stone-900' : 'border-stone-800'}`}>
                                  <Image 
                                    src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} 
                                    alt={p.provider_name}
                                    title={p.provider_name}
                                    fill
                                    sizes="36px"
                                    className="object-cover"
                                  />
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-500 italic">No hay información de streaming disponible.</span>
                    )}
                  </div>

                  <button 
                    onClick={() => movieId && onPlayTrailer(movieId)}
                    className={getTrailerBtnClass()}
                  >
                    <Play size={18} className={theme === 'comedy' || theme === 'scifi' || theme === 'horror' ? "" : "fill-black"} />
                    <span>Ver Tráiler</span>
                  </button>

                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
