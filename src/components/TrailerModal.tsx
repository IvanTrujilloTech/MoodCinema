"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAppContext } from '@/context/AppContext';

interface TrailerModalProps {
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ movieId, isOpen, onClose }: TrailerModalProps) {
  const { language, theme } = useAppContext();
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movieId) {
      const fetchTrailer = async () => {
        setIsLoading(true);
        try {
          const res = await api.getTrailer(movieId, language);
          if (res.success && res.data) {
            setTrailerKey(res.data.key);
          } else {
            setTrailerKey(null);
          }
        } catch (error) {
          console.error("Error fetching trailer:", error);
          setTrailerKey(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTrailer();
    }
  }, [isOpen, movieId, language]);

  const getContainerClass = () => {
    const base = "relative w-full max-w-4xl aspect-video overflow-hidden z-10 bg-black ";
    if (theme === 'comedy') {
      return base + "neobrutalism-card";
    }
    if (theme === 'scifi') {
      return base + "terminal-box border-2 border-green-500";
    }
    if (theme === 'horror' || theme === 'chaos') {
      const stroke = theme === 'horror' ? 'border-[#e63946]' : 'border-fuchsia-500';
      return base + `border-2 ${stroke}`;
    }
    if (theme === 'comfort') {
      return base + "warm-vintage-card border-2 border-[#e5a93b]";
    }
    return base + "ticket-stub border-2 border-[#f5a623]";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className={getContainerClass()}
          >
            <button
              onClick={onClose}
              className={getCloseBtnClass()}
            >
              <X size={20} />
            </button>

            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className={`w-8 h-8 border-2 rounded-full animate-spin ${theme === 'scifi' ? 'border-green-500 border-t-transparent' : theme === 'horror' ? 'border-[#e63946] border-t-transparent' : 'border-[#f5a623] border-t-transparent'}`} />
              </div>
            ) : trailerKey ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center flex-col ${theme === 'scifi' ? 'text-green-500 font-crt' : 'text-gray-400 font-typewriter'}`}>
                <p>{theme === 'scifi' ? 'SYSTEM_ALERT: NO_TRAILER_STREAM_FOUND' : 'No se ha encontrado tráiler para esta película.'}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
