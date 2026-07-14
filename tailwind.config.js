/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3a542d',
        'primary-dark': '#2c4022',
        background: '#000000', // Deep premium jet black
        card: '#111111', // Distinct premium dark gray for cards
        textPrimary: '#ffffff',
        textSecondary: '#a1a1aa',
        border: '#222222',
        success: '#10b981',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'border-flow': 'border-flow 3s ease-in-out infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        'border-flow': {
          '0%, 100%': { borderColor: 'rgba(58, 84, 45, 0.2)' },
          '50%': { borderColor: 'rgba(58, 84, 45, 1)' },
        },
        'wave': {
          '0%, 100%': { transform: 'scaleY(0.5)', opacity: '0.5' },
          '50%': { transform: 'scaleY(1.5)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
