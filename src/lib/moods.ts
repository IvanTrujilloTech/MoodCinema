import { Mood } from '@/types';

export const MOODS: Mood[] = [
  {
    id: 'cry',
    icon: 'CloudRain',
    color: 'from-blue-600 to-indigo-900',
    label: {
      es: 'Drama',
      en: 'Drama',
      ca: 'Drama'
    },
    description: {
      es: 'Historias intensas y dramas emotivos',
      en: 'Intense stories and emotional dramas',
      ca: 'Històries intenses i drames emotius'
    }
  },
  {
    id: 'adrenaline',
    icon: 'Zap',
    color: 'from-red-600 to-orange-800',
    label: {
      es: 'Acción y Thriller',
      en: 'Action & Thriller',
      ca: 'Acció i Thriller'
    },
    description: {
      es: 'Películas trepidantes y llenas de adrenalina',
      en: 'Fast-paced, adrenaline-filled movies',
      ca: 'Pel·lícules trepidants i plenes d\'adrenalina'
    }
  },
  {
    id: 'braindead',
    icon: 'Laugh',
    color: 'from-pink-500 to-purple-800',
    label: {
      es: 'Comedia y Animación',
      en: 'Comedy & Animation',
      ca: 'Comèdia i Animació'
    },
    description: {
      es: 'Humor, comedia ligera y cine animado',
      en: 'Humor, light comedy and animated films',
      ca: 'Humor, comèdia lleugera i cinema animat'
    }
  },
  {
    id: 'psycho',
    icon: 'Ghost',
    color: 'from-emerald-900 to-slate-900',
    label: {
      es: 'Terror y Misterio',
      en: 'Horror & Mystery',
      ca: 'Terror i Misteri'
    },
    description: {
      es: 'Horror perturbador y misterios psicológicos',
      en: 'Disturbing horror and psychological mysteries',
      ca: 'Horror pertorbador i misteris psicològics'
    }
  },
  {
    id: 'romance',
    icon: 'Heart',
    color: 'from-rose-500 to-red-800',
    label: {
      es: 'Romance y Amor',
      en: 'Romance & Love',
      ca: 'Romance i Amor'
    },
    description: {
      es: 'Historias de amor y conexiones profundas',
      en: 'Love stories and deep connections',
      ca: 'Històries d\'amor i connexions profundes'
    }
  },
  {
    id: 'adventure',
    icon: 'Compass',
    color: 'from-amber-600 to-green-800',
    label: {
      es: 'Aventura y Ciencia Ficción',
      en: 'Adventure & Sci-Fi',
      ca: 'Aventura i Ciència Ficció'
    },
    description: {
      es: 'Exploración, viajes épicos y mundos futuristas',
      en: 'Exploration, epic journeys and futuristic worlds',
      ca: 'Exploració, viatges èpics i mons futuristes'
    }
  },
  {
    id: 'comfort',
    icon: 'Coffee',
    color: 'from-amber-300 to-orange-500',
    label: {
      es: 'Favoritas (Comfort)',
      en: 'Favorites (Comfort)',
      ca: 'Favorites (Comfort)'
    },
    description: {
      es: 'Tus películas favoritas valoradas con 4+ estrellas',
      en: 'Your favorite movies rated with 4+ stars',
      ca: 'Les teves pel·lícules favorites valorades amb 4+ estrelles'
    }
  },
  {
    id: 'chaos',
    icon: 'Shuffle',
    color: 'from-fuchsia-600 to-violet-900',
    label: {
      es: 'Cine de Culto (Aleatorio)',
      en: 'Cult Classics (Random)',
      ca: 'Cine de Culte (Aleatori)'
    },
    description: {
      es: 'Una selección aleatoria de clásicos de culto',
      en: 'A random selection of cult classics',
      ca: 'Una selecció aleatòria de clàssics de culte'
    }
  }
];
