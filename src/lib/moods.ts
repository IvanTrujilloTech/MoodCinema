import { Mood } from '@/types';

export const MOODS: Mood[] = [
  {
    id: 'cry',
    icon: '🌧️',
    color: 'from-blue-600 to-indigo-900',
    label: {
      es: 'Con ganas de llorar',
      en: 'In the mood to cry',
      ca: 'Amb ganes de plorar'
    },
    description: {
      es: 'Dramas intensos y emotivos',
      en: 'Intense and emotional dramas',
      ca: 'Drames intensos i emotius'
    }
  },
  {
    id: 'adrenaline',
    icon: '⚡',
    color: 'from-red-600 to-orange-800',
    label: {
      es: 'Inyección de adrenalina',
      en: 'Adrenaline shot',
      ca: 'Injecció d\'adrenalina'
    },
    description: {
      es: 'Acción y thrillers trepidantes',
      en: 'Fast-paced action and thrillers',
      ca: 'Acció i thrillers trepidants'
    }
  },
  {
    id: 'braindead',
    icon: '🧠',
    color: 'from-pink-500 to-purple-800',
    label: {
      es: 'Cerebro apagado',
      en: 'Brain turned off',
      ca: 'Cervell apagat'
    },
    description: {
      es: 'Comedia ligera y animación',
      en: 'Light comedy and animation',
      ca: 'Comèdia lleugera i animació'
    }
  },
  {
    id: 'psycho',
    icon: '👁️',
    color: 'from-emerald-900 to-slate-900',
    label: {
      es: 'Terror psicológico',
      en: 'Psychological horror',
      ca: 'Terror psicològic'
    },
    description: {
      es: 'Horror y misterios perturbadores',
      en: 'Disturbing horror and mysteries',
      ca: 'Horror i misteris pertorbadors'
    }
  },
  {
    id: 'romance',
    icon: '❤️',
    color: 'from-rose-500 to-red-800',
    label: {
      es: 'Noche romántica',
      en: 'Romantic night',
      ca: 'Nit romàntica'
    },
    description: {
      es: 'Historias de amor',
      en: 'Love stories',
      ca: 'Històries d\'amor'
    }
  },
  {
    id: 'adventure',
    icon: '🗺️',
    color: 'from-amber-600 to-green-800',
    label: {
      es: 'A explorar el mundo',
      en: 'Let\'s explore the world',
      ca: 'A explorar el món'
    },
    description: {
      es: 'Aventuras y ciencia ficción',
      en: 'Adventures and Sci-Fi',
      ca: 'Aventures i ciència ficció'
    }
  },
  {
    id: 'comfort',
    icon: '🔁',
    color: 'from-amber-300 to-orange-500',
    label: {
      es: 'Comfort Movie',
      en: 'Comfort Movie',
      ca: 'Comfort Movie'
    },
    description: {
      es: 'Repetir tus favoritas de 4+ estrellas',
      en: 'Rewatch your 4+ star favorites',
      ca: 'Repetir les teves favorites de 4+ estrelles'
    }
  },
  {
    id: 'chaos',
    icon: '🎰',
    color: 'from-fuchsia-600 to-violet-900',
    label: {
      es: 'Ruleta del Caos',
      en: 'Chaos Roulette',
      ca: 'Ruleta del Caos'
    },
    description: {
      es: 'Una peli de culto aleatoria',
      en: 'A random cult movie',
      ca: 'Una pel·li de culte aleatòria'
    }
  }
];
