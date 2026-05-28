"use client";

import { Download } from 'lucide-react';
import { api } from '@/lib/api';
import { Movie } from '@/types';
import { useState } from 'react';

interface ExportButtonProps {
  movies: Movie[];
  className?: string;
}

export default function ExportButton({ movies, className = '' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await api.exportCSV(movies);
    } catch (error) {
      console.error("Export failed", error);
      alert("Error al exportar CSV");
    } finally {
      setIsExporting(false);
    }
  };

  if (movies.length === 0) return null;

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 px-4 py-2 bg-cinema-card hover:bg-white/10 border border-cinema-border rounded-lg transition-colors font-medium ${className}`}
    >
      <Download size={18} className={isExporting ? "animate-pulse" : ""} />
      {isExporting ? "Exportando..." : "Exportar a Letterboxd (CSV)"}
    </button>
  );
}
