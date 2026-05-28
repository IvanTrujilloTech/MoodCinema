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
  const { language } = useAppContext();
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
            className="relative w-full max-w-4xl aspect-video glass-panel overflow-hidden z-10 bg-black"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-cinema-danger/80 text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cinema-accent border-t-transparent rounded-full animate-spin" />
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
              <div className="w-full h-full flex items-center justify-center flex-col text-gray-400">
                <p>No trailer available</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
