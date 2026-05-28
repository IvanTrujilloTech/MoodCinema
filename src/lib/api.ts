const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

import { RecommendResponse, RouletteResponse, TrailerResponse } from '@/types';

export const api = {
  /**
   * Test if a Letterboxd username is valid
   */
  async checkUser(username: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/letterboxd/${username}`);
      const data = await res.json();
      return data.success;
    } catch (e) {
      return false;
    }
  },

  /**
   * Get movie recommendations based on mood
   */
  async getRecommendations(mood: string, username: string, lang: string, page: number = 1): Promise<RecommendResponse> {
    const res = await fetch(
      `${API_BASE_URL}/movies/recommend?mood=${mood}&username=${username}&lang=${lang}&page=${page}`
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Error fetching recommendations');
    }
    return res.json();
  },

  /**
   * Get a random cult movie
   */
  async getRoulette(lang: string): Promise<RouletteResponse> {
    const res = await fetch(`${API_BASE_URL}/movies/roulette?lang=${lang}`);
    if (!res.ok) {
      throw new Error('Error spinning the roulette');
    }
    return res.json();
  },

  /**
   * Get the YouTube trailer for a movie
   */
  async getTrailer(movieId: number, lang: string): Promise<TrailerResponse> {
    const res = await fetch(`${API_BASE_URL}/movies/${movieId}/trailer?lang=${lang}`);
    return res.json();
  },

  /**
   * Export to CSV
   * This is handled directly via browser download by pointing to a specific endpoint
   * but for POST requests we can handle it here
   */
  async exportCSV(movies: any[]) {
    const res = await fetch(`${API_BASE_URL}/export/csv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movies })
    });
    
    if (!res.ok) throw new Error('Failed to export CSV');
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moodcinema-recommendations.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  /**
   * Get full details for a movie
   */
  async getMovieDetails(movieId: number, lang: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/movies/${movieId}/details?lang=${lang}`);
    if (!res.ok) throw new Error('Failed to fetch movie details');
    return res.json();
  },

  /**
   * Get movies for a specific actor, filtering watched ones
   */
  async getActorMovies(actorId: number, username: string, lang: string, page: number = 1): Promise<RecommendResponse> {
    const res = await fetch(`${API_BASE_URL}/movies/actor/${actorId}?username=${username}&lang=${lang}&page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch actor movies');
    return res.json();
  },

  /**
   * Search for an actor and get their movies
   */
  async searchActorMovies(query: string, username: string, lang: string, page: number = 1): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/movies/actor-search?query=${encodeURIComponent(query)}&username=${username}&lang=${lang}&page=${page}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Error searching for actor');
    }
    return res.json();
  }
};
