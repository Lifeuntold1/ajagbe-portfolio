/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.25, 1, 0.5, 1) both',
        'float-up': 'floatUp 5s ease-in-out forwards',
        'flash': 'flash 1s cubic-bezier(0.4, 0, 0.2, 1) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        floatUp: {
          '0%': { transform: 'translateY(0) rotate(-5deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '50%': { transform: 'translateY(-60vh) rotate(5deg)' },
          '100%': { transform: 'translateY(-120vh) rotate(-5deg)', opacity: 0 }
        },
        flash: {
          '0%': { opacity: 0 },
          '20%': { opacity: 1 },
          '100%': { opacity: 0 }
        }
      }
    },
  },
  plugins: [],
};
