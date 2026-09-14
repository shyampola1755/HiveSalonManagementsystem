/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      colors: {
        brand: {
          50: '#fbf8f0',
          100: '#f6eedb',
          200: '#eddcb5',
          300: '#e1c386',
          400: '#d5a85b',
          500: '#cb923c',
          600: '#bd7b30',
          700: '#9d5e27',
          800: '#804b25',
          900: '#693e22',
          950: '#3a2010',
        },
        dark: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px -5px rgba(203, 146, 60, 0.4)',
        subtle: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
