"use client";

import { Movie } from '@/types';
import { Play, Film, Calendar, Star, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

interface MovieCardProps {
  movie: Movie;
  onPlayTrailer: (id: number) => void;
  onShowDetails?: (id: number) => void;
  index: number;
}

export default function MovieCard({ movie, onPlayTrailer, onShowDetails, index }: MovieCardProps) {
  const { theme } = useAppContext();
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  // 1. POLAROID STYLE (Romance and Drama)
  if (theme === 'romance' || theme === 'drama') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 35, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className="polaroid-frame text-stone-900 flex flex-col h-full transform hover:rotate-0 hover:scale-[1.03] transition-all duration-300 relative group"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-stone-100 group border border-stone-200">
          <Image 
            src={posterUrl} 
            alt={movie.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={() => onPlayTrailer(movie.id)}
              className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg"
            >
              <Play size={20} className="ml-1 fill-white" />
            </button>
          </div>

          {/* rating handwritten style */}
          <div className="absolute top-2 right-2 bg-rose-100 border border-rose-300 text-rose-700 px-2 py-0.5 rounded text-xs font-bold font-typewriter shadow-md">
            ★ {movie.vote_average.toFixed(1)}
          </div>
        </div>

        <div className="pt-4 flex flex-col flex-grow text-left font-typewriter">
          <h3 className="font-bold text-base leading-tight text-stone-900 line-clamp-1" title={movie.title}>
            {movie.title}
          </h3>
          <span className="text-[10px] text-stone-500 mt-1 block">
            FECHA: {movie.release_date ? movie.release_date.substring(0, 4) : '199X'}
          </span>
          <p className="text-[10px] text-stone-600 line-clamp-3 mt-2 mb-4 leading-normal">
            {movie.overview || "Nostálgica descripción no disponible en este momento."}
          </p>
          
          {onShowDetails && (
            <button 
              onClick={() => onShowDetails(movie.id)}
              className="w-full py-1.5 mt-auto bg-stone-100 hover:bg-stone-200 border border-stone-300 text-xs font-bold text-stone-800 transition-colors"
            >
              Inspeccionar
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // 2. NEOBRUTALISM POP ART (Comedy / Animation)
  if (theme === 'comedy') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="neobrutalism-card p-3 flex flex-col h-full bg-white relative group"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden border-2 border-stone-900 bg-stone-150">
          <Image 
            src={posterUrl} 
            alt={movie.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          
          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button 
              onClick={() => onPlayTrailer(movie.id)}
              className="w-14 h-14 bg-pink-500 text-stone-950 border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all"
            >
              <Play size={20} className="ml-0.5 fill-current" />
            </button>
          </div>

          {/* Rating tag */}
          <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-stone-900 px-2 py-0.5 text-xs font-extrabold text-stone-950 shadow-[1px_1px_0px_#000]">
            ★ {movie.vote_average.toFixed(1)}
          </div>
        </div>

        <div className="pt-3 flex flex-col flex-grow text-left">
          <h3 className="font-heading font-black text-base text-stone-900 leading-tight line-clamp-1">
            {movie.title}
          </h3>
          <div className="text-[10px] font-bold text-stone-700 mt-1 flex items-center gap-1">
            <Calendar size={10} />
            <span>{movie.release_date ? movie.release_date.substring(0, 4) : ''}</span>
          </div>
          <p className="text-[10px] text-stone-700 line-clamp-3 mt-2 mb-3 leading-relaxed">
            {movie.overview || "¡Diversión sin descripción!"}
          </p>
          
          {onShowDetails && (
            <button 
              onClick={() => onShowDetails(movie.id)}
              className="w-full py-1.5 mt-auto neobrutalism-btn text-xs font-black uppercase text-center"
            >
              Ver Info
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // 3. VHS TAPE SLEEVE / HORROR SLASHER (Terror & Chaos)
  if (theme === 'horror' || theme === 'chaos') {
    const strokeColor = theme === 'horror' ? 'border-[#e63946]' : 'border-fuchsia-500';
    const glowShadow = theme === 'horror' ? 'hover:shadow-[0_0_12px_rgba(230,57,70,0.35)]' : 'hover:shadow-[0_0_12px_rgba(217,70,239,0.35)]';
    const textColor = theme === 'horror' ? 'text-[#e63946]' : 'text-fuchsia-400';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-stone-950 border-2 ${strokeColor} ${glowShadow} rounded-none p-2 flex flex-col h-full font-crt group transition-all`}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-black border border-stone-850">
          <Image 
            src={posterUrl} 
            alt={movie.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
          />
          
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={() => onPlayTrailer(movie.id)}
              className={`w-14 h-14 bg-transparent border-2 ${strokeColor} ${textColor} flex items-center justify-center hover:scale-105 active:scale-95 transition-transform`}
            >
              <Play size={20} className="ml-0.5 fill-current" />
            </button>
          </div>

          {/* Rating tag */}
          <div className={`absolute top-2 right-2 bg-black border ${strokeColor} ${textColor} px-2 py-0.5 text-xs font-bold`}>
            VOTE: {movie.vote_average.toFixed(1)}
          </div>
          
          {/* Tracking line detail */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-stone-900/60 to-transparent flex items-center justify-between px-2 text-[8px] opacity-40 font-crt select-none">
            <span>VHS SP-PLAY</span>
            <span>0:00:23</span>
          </div>
        </div>

        <div className="pt-3 flex flex-col flex-grow text-left">
          <h3 className={`font-crt text-base tracking-widest ${textColor} font-bold leading-tight line-clamp-1`}>
            {movie.title.toUpperCase()}
          </h3>
          <span className="text-[9px] text-stone-500 block mt-1 tracking-widest">
            VCR_DATE: {movie.release_date ? movie.release_date.substring(0, 4) : 'UNKNOWN'}
          </span>
          <p className="text-[10px] text-stone-400 line-clamp-3 mt-2 mb-4 leading-normal font-sans">
            {movie.overview || "No se ha encontrado registro o descripción del VHS analizado."}
          </p>
          
          {onShowDetails && (
            <button 
              onClick={() => onShowDetails(movie.id)}
              className={`w-full py-1.5 mt-auto bg-transparent border ${strokeColor} ${textColor} hover:bg-white/5 text-xs font-bold uppercase transition-colors`}
            >
              -- ABRIR ESTUCHE --
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // 4. MICRO MS-DOS TERMINAL SCREEN (Adventure & Sci-Fi)
  if (theme === 'scifi') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="terminal-box bg-black p-2 flex flex-col h-full font-crt text-green-500 relative group"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden border border-green-500/40 bg-stone-950">
          <Image 
            src={posterUrl} 
            alt={movie.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-75 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-300"
          />
          
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={() => onPlayTrailer(movie.id)}
              className="w-12 h-12 bg-transparent border border-green-500 text-green-500 flex items-center justify-center hover:bg-green-500/10 active:scale-95 transition-all"
            >
              <Play size={18} className="ml-0.5 fill-current" />
            </button>
          </div>

          <div className="absolute top-2 right-2 bg-black border border-green-500 text-green-500 px-1.5 py-0.5 text-[10px] font-bold">
            SYS_RAT: {movie.vote_average.toFixed(1)}
          </div>
        </div>

        <div className="pt-3 flex flex-col flex-grow text-left">
          <h3 className="font-bold text-sm tracking-wider leading-tight text-green-500 line-clamp-1">
            &gt; {movie.title.toUpperCase()}
          </h3>
          <div className="text-[9px] text-green-700 mt-1">
            {"SYS_YEAR // "}{movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
          </div>
          <p className="text-[10px] text-green-600 line-clamp-3 mt-2 mb-3 leading-normal font-sans opacity-85">
            {movie.overview || "System.Error: Descripcion fallida."}
          </p>
          
          {onShowDetails && (
            <button 
              onClick={() => onShowDetails(movie.id)}
              className="w-full py-1 mt-auto bg-green-950/20 border border-green-500 hover:bg-green-500/10 text-[10px] font-bold text-green-500 transition-colors uppercase tracking-widest text-center"
            >
              READ_LOG.EXE
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // 5. COZY FILMSTRIP (Comfort)
  if (theme === 'comfort') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="warm-vintage-card film-strip-border p-2.5 flex flex-col h-full bg-[#1c130d] relative group"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-stone-900 border border-[#e5a93b]/20">
          <Image 
            src={posterUrl} 
            alt={movie.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover filter sepia-[0.25]"
          />
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={() => onPlayTrailer(movie.id)}
              className="w-14 h-14 rounded-full bg-[#e5a93b] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              <Play size={20} className="ml-0.5 fill-black" />
            </button>
          </div>

          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md border border-[#e5a93b]/40 text-[#e5a93b] px-2 py-0.5 rounded text-xs font-bold font-typewriter">
            ★ {movie.vote_average.toFixed(1)}
          </div>
        </div>

        <div className="pt-3 flex flex-col flex-grow text-left font-typewriter">
          <h3 className="font-bold text-sm text-[#e5a93b] leading-tight line-clamp-1">
            {movie.title}
          </h3>
          <span className="text-[9px] text-[#e5a93b]/60 block mt-1">
            EDICIÓN: {movie.release_date ? movie.release_date.substring(0, 4) : ''}
          </span>
          <p className="text-[10px] text-stone-400 line-clamp-3 mt-2 mb-3 leading-normal font-sans">
            {movie.overview || "Un film confortable sin descripción disponible."}
          </p>
          
          {onShowDetails && (
            <button 
              onClick={() => onShowDetails(movie.id)}
              className="w-full py-1.5 mt-auto bg-stone-900/60 hover:bg-[#e5a93b]/20 border border-[#e5a93b]/30 rounded text-[10px] font-bold text-[#e5a93b] transition-colors"
            >
              Ver Detalles
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // 6. DEFAULT MARQUEE THEATER LOOK (Marquee / Lobby / Actor)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="ticket-stub bg-[#171419] border border-[#f5a623]/60 hover:border-[#f5a623] hover:shadow-[0_0_15px_rgba(245,166,35,0.15)] flex flex-col h-full relative group transition-all"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black group border-b border-[#f5a623]/10">
        <Image 
          src={posterUrl} 
          alt={movie.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={() => onPlayTrailer(movie.id)}
            className="w-14 h-14 rounded-full bg-[#f5a623] hover:bg-amber-400 text-black flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl"
          >
            <Play size={20} className="ml-0.5 fill-black text-black" />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-[#f5a623]/50 text-xs font-bold text-[#f5a623]">
          ★ {movie.vote_average.toFixed(1)}
        </div>
        
        {/* Letterboxd Comfort Badge */}
        {movie.letterboxdRating && (
          <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-lg border border-emerald-500/30">
            LBOXD: {movie.letterboxdRating}★
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow text-left">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="font-typewriter font-bold text-sm text-stone-100 leading-tight line-clamp-1" title={movie.title}>
            {movie.title}
          </h3>
          <span className="text-stone-500 text-[10px] font-crt ml-2 shrink-0">
            {movie.release_date ? movie.release_date.substring(0, 4) : ''}
          </span>
        </div>
        <p className="text-[10px] text-stone-400 line-clamp-3 mt-1 mb-4 leading-normal font-sans">
          {movie.overview || "Película seleccionada para tu maratón vintage."}
        </p>
        
        {onShowDetails && (
          <button 
            onClick={() => onShowDetails(movie.id)}
            className="w-full py-1.5 mt-auto bg-stone-900 hover:bg-stone-850 rounded border border-stone-800 text-[10px] font-typewriter text-stone-300 transition-colors uppercase tracking-wider text-center"
          >
            Detalles
          </button>
        )}
      </div>
    </motion.div>
  );
}
