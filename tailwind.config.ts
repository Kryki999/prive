import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        prive: {
          rose: '#E5007E',
          plum: '#751F5E',
          DEFAULT: '#E5007E',
          dark: '#751F5E',
          white: '#FFFFFF',
          surface: '#F8F8F8',
          border: '#EBEBEB',
          text: '#1A1A1A',
          'text-muted': '#6B6B6B',
        },
      },
      backgroundImage: {
        'prive-gradient': 'linear-gradient(135deg, #E5007E 0%, #751F5E 100%)',
        'prive-gradient-soft':
          'linear-gradient(135deg, rgba(229,0,126,0.06) 0%, rgba(117,31,94,0.04) 100%)',
      },
      boxShadow: {
        'prive-card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'prive-card-hover': '0 8px 32px rgba(229, 0, 126, 0.12)',
        'prive-btn': '0 4px 16px rgba(229, 0, 126, 0.28)',
        'prive-btn-hover': '0 8px 24px rgba(117, 31, 94, 0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
