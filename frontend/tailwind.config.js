/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b2545',
          dark: '#081c34',
          blue: '#133c55',
          accent: '#1e40af',
          saffron: '#ea580c',
          saffronLight: '#f97316',
          gold: '#d97706',
          green: '#059669',
          greenLight: '#10b981',
          slate: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
