/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FF3B30',
        'primary-dark': '#CC2E24',
        surface: {
          DEFAULT: '#0A0A0A',
          card: '#141414',
          elevated: '#1C1C1C',
          border: '#2A2A2A'
        }
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif']
      }
    }
  },
  plugins: []
}
