/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#0B0910',
          900: '#0F0D15',
          850: '#15121F',
          800: '#1A1625',
          700: '#261E35',
          600: '#382D4F',
        },
        mars: {
          500: '#E53E3E',
          600: '#C53030',
          orange: '#DD6B20',
          gold: '#ECC94B',
          cyan: '#00B5D8',
          emerald: '#10B981',
          purple: '#805AD5',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(229, 62, 62, 0.4)',
        'neon-cyan': '0 0 20px rgba(0, 181, 216, 0.4)',
        'neon-emerald': '0 0 20px rgba(16, 185, 129, 0.4)',
        'neon-orange': '0 0 20px rgba(221, 107, 32, 0.4)',
        'neon-purple': '0 0 20px rgba(128, 90, 213, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
