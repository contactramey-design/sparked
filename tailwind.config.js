/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#60A5FA',
        accent: '#F472B6',
        danger: '#ef4444',
        sparki: {
          blue: '#60A5FA',
          pink: '#F472B6',
          mint: '#34D399',
          yellow: '#FBBF24',
          soft: '#F0F9FF',
          softEnd: '#E0F2FE',
        },
        /** Semantic surfaces — pair with CSS vars from AppShell when needed */
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          school: '#fff7ed',
          border: 'rgba(15, 23, 42, 0.08)',
        },
      },
      fontFamily: {
        heading: ['Fredoka One', 'system-ui', 'sans-serif'],
        body: ['Baloo 2', 'Comic Neue', 'system-ui', 'sans-serif'],
        school: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        sparkle: '0 10px 30px -10px rgba(96, 165, 250, 0.4)',
        'sparkle-pink': '0 10px 30px -10px rgba(244, 114, 182, 0.35)',
      },
      animation: {
        'float-bounce': 'floatBounce 3s ease-in-out infinite',
        'sparkle-in': 'sparkleIn 0.6s ease-out forwards',
        'pop-in': 'popIn 0.5s ease-out forwards',
        'badge-spin': 'badgeSpin 0.8s ease-out forwards',
      },
      keyframes: {
        floatBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sparkleIn: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        badgeSpin: {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '60%': { transform: 'scale(1.15) rotate(10deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
