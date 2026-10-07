/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crime: {
          darkest: '#070a10',
          dark: '#0d121d',
          surface: '#131927',
          card: '#182133',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)'
        },
        police: {
          DEFAULT: '#3b82f6',
          glow: 'rgba(59, 130, 246, 0.35)',
          light: '#60a5fa'
        },
        thief: {
          DEFAULT: '#f43f5e',
          glow: 'rgba(244, 63, 94, 0.35)',
          light: '#fb7185'
        },
        undercover: {
          DEFAULT: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.35)',
          light: '#fbbf24'
        },
        evidence: {
          DEFAULT: '#eab308',
          glow: 'rgba(234, 179, 8, 0.3)'
        }
      },
      fontFamily: {
        headline: ['Syne', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
