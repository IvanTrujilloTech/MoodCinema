"use client";

import { Movie } from '@/types';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MovieCardProps {
  movie: Movie;
  onPlayTrailer: (id: number) => void;
  onShowDetails?: (id: number) => void;
  index: number;
}

export default function MovieCard({ movie, onPlayTrailer, onShowDetails, index }: MovieCardProps) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-panel group overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-cinema-dark group">
        <Image 
          src={posterUrl} 
          alt={movie.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Play trailer overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={() => onPlayTrailer(movie.id)}
            className="w-16 h-16 rounded-full bg-cinema-accent/90 text-black flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300"
          >
            <Play size={24} className="ml-1" />
          </button>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-sm font-bold text-cinema-accent border border-cinema-border">
          ★ {movie.vote_average.toFixed(1)}
        </div>
        
        {/* Letterboxd Comfort Badge if applicable */}
        {movie.letterboxdRating && (
          <div className="absolute top-2 left-2 bg-green-500/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg">
            Letterboxd: {movie.letterboxdRating}★
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-bold text-lg leading-tight line-clamp-2" title={movie.title}>
            {movie.title}
          </h3>
          <span className="text-gray-400 text-sm ml-2 shrink-0">
            {movie.release_date ? movie.release_date.substring(0, 4) : ''}
          </span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-3 mt-auto mb-4">
          {movie.overview || "No hay descripción disponible para esta película."}
        </p>
        
        {onShowDetails && (
          <button 
            onClick={() => onShowDetails(movie.id)}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-cinema-border"
          >
            Leer Más
          </button>
        )}
      </div>
    </motion.div>
  );
}
