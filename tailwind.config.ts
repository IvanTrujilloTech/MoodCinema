import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cinema: {
          dark: "#0a0a0f",
          card: "rgba(255, 255, 255, 0.03)",
          accent: "#f5a623", // Golden accent
          danger: "#e63946", // Crimson
          border: "rgba(255, 255, 255, 0.08)",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-outfit)'],
        typewriter: ['var(--font-special-elite)', 'serif'],
        crt: ['var(--font-vt323)', 'monospace'],
      },
      keyframes: {
        flicker: {
          '0%': { opacity: '0.96' },
          '100%': { opacity: '1.0' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-1.5px, 1.5px)' },
          '40%': { transform: 'translate(-1.5px, -1.5px)' },
          '60%': { transform: 'translate(1.5px, 1.5px)' },
          '80%': { transform: 'translate(1.5px, -1.5px)' },
          '100%': { transform: 'translate(0)' },
        },
        'marquee-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'neon-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px currentColor) drop-shadow(0 0 12px currentColor)' },
          '50%': { filter: 'drop-shadow(0 0 6px currentColor) drop-shadow(0 0 20px currentColor)' },
        }
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
        'flicker': 'flicker 0.15s infinite alternate',
        'glitch': 'glitch 0.25s infinite',
        'marquee-blink': 'marquee-blink 1s steps(2, start) infinite',
        'neon-pulse': 'neon-pulse 2s infinite',
      }
    },
  },
  plugins: [],
};

export default config;
