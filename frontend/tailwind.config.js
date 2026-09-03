/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          DEFAULT: '#080a12',
          card: '#0e1222',
          cardMuted: '#0a0d18',
          border: '#1a2238',
          borderLight: '#25304f',
          hover: '#141a30',
          active: '#1c2444',
        },
        cockpit: {
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          indigo: '#6366f1',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0b0e1a 0%, #070911 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(6,182,212,0.03) 100%)',
        'gradient-card-hover': 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(6,182,212,0.06) 100%)',
        'gradient-radial-glow': 'radial-gradient(ellipse at top, rgba(99,102,241,0.15), transparent 70%)',
      },
      boxShadow: {
        'brand': '0 0 35px rgba(99,102,241,0.25)',
        'card': '0 10px 30px -5px rgba(0,0,0,0.5), 0 0 1px 1px rgba(255,255,255,0.05)',
        'glow': '0 0 25px rgba(99,102,241,0.45)',
        'glow-cyan': '0 0 25px rgba(6,182,212,0.4)',
        'glow-emerald': '0 0 25px rgba(16,185,129,0.35)',
        'cockpit': '0 15px 45px -10px rgba(0,0,0,0.8), 0 0 1px 1px rgba(255,255,255,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'orb-glow': 'orbGlow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        orbGlow: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.15)', opacity: '0.9' },
        }
      },
    },
  },
  plugins: [],
};
