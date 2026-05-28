"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, Star, Calendar } from 'lucide-react';
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
  const { language } = useAppContext();
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

  // Extract ES providers (or fallback to US if not available)
  const langCode = language.split('-')[1] || 'ES'; // Assuming es-ES -> ES
  const providers = details?.['watch/providers']?.results?.[langCode] || details?.['watch/providers']?.results?.['US'];

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
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-panel bg-cinema-dark rounded-2xl shadow-2xl z-10 flex flex-col md:flex-row hide-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-cinema-danger text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          {isLoading || !details ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cinema-accent border-t-transparent rounded-full animate-spin" />
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
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-transparent md:hidden" />
              </div>

              {/* Info Section */}
              <div className="w-full md:w-2/3 p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-2">{details.title}</h2>
                  {details.tagline && <p className="text-cinema-accent italic mb-4">{details.tagline}</p>}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400" /> {details.vote_average?.toFixed(1)}</span>
                    <span className="flex items-center gap-1"><Calendar size={16} /> {details.release_date?.substring(0, 4)}</span>
                    <span className="flex items-center gap-1"><Clock size={16} /> {details.runtime} min</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {details.genres?.map((g: any) => (
                    <span key={g.id} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                      {g.name}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-2">Sinopsis</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {details.overview || "No hay descripción disponible."}
                  </p>
                </div>

                {/* Cast */}
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Reparto Principal</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.credits?.cast?.slice(0, 8).map((actor: any) => (
                      <button 
                        key={actor.id}
                        onClick={() => {
                          onClose();
                          onActorClick(actor.id, actor.name);
                        }}
                        className="px-3 py-1.5 bg-cinema-card border border-cinema-border hover:bg-cinema-accent/20 hover:border-cinema-accent/50 rounded-lg text-sm transition-colors text-left flex items-center gap-2 group"
                      >
                        {actor.profile_path && (
                          <div className="w-6 h-6 relative shrink-0">
                            <Image 
                              src={`https://image.tmdb.org/t/p/w45${actor.profile_path}`} 
                              alt={actor.name} 
                              fill
                              sizes="24px"
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}
                        <span className="group-hover:text-cinema-accent transition-colors">{actor.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">✨ Haz clic en un actor para buscar sus películas no vistas.</p>
                </div>

                {/* Watch Providers & Trailer */}
                <div className="mt-auto pt-6 border-t border-cinema-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Providers */}
                  <div>
                    {providers && (providers.flatrate || providers.rent || providers.buy) ? (
                      <div>
                        <span className="text-sm text-gray-400 mb-2 block">Dónde ver (España):</span>
                        <div className="flex flex-wrap gap-2">
                          {/* Combine all unique providers */}
                          {Array.from(new Set([...(providers.flatrate || []), ...(providers.rent || []), ...(providers.buy || [])].map(p => p.provider_id)))
                            .slice(0, 5)
                            .map(id => {
                              const p = [...(providers.flatrate || []), ...(providers.rent || []), ...(providers.buy || [])].find(p => p.provider_id === id);
                              return (
                                <div key={p.provider_id} className="w-10 h-10 relative">
                                  <Image 
                                    src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} 
                                    alt={p.provider_name}
                                    title={p.provider_name}
                                    fill
                                    sizes="40px"
                                    className="rounded-lg object-cover"
                                  />
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">No hay información de streaming disponible.</span>
                    )}
                  </div>

                  <button 
                    onClick={() => onPlayTrailer(movieId)}
                    className="flex items-center gap-2 px-6 py-3 bg-cinema-accent text-black font-bold rounded-lg hover:bg-amber-400 transition-colors w-full sm:w-auto justify-center"
                  >
                    <Play size={20} className="fill-black" />
                    Ver Tráiler
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
