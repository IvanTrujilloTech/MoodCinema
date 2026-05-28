export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  letterboxdRating?: number; // Added when in Comfort Mode
}

export interface Mood {
  id: string;
  icon: string;
  label: {
    es: string;
    en: string;
    ca: string;
  };
  color: string;
  description: {
    es: string;
    en: string;
    ca: string;
  };
}

export type Language = 'es-ES' | 'en-US' | 'ca-ES';

export interface RecommendResponse {
  success: boolean;
  mood: string;
  count: number;
  data: Movie[];
  message?: string;
}

export interface RouletteResponse {
  success: boolean;
  data: Movie;
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface TrailerResponse {
  success: boolean;
  data: Video | null;
  message?: string;
}
