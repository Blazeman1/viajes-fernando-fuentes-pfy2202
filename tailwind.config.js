/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de Rumbo Sur: azul profundo de mar, coral de atardecer y arena.
        mar: { 50: '#eef6f7', 100: '#d3e8eb', 200: '#a9d1d7', 500: '#1f7a8c', 600: '#176273', 700: '#124e5c', 800: '#0d3b46', 900: '#082830' },
        coral: { 50: '#fdf1ed', 100: '#fbdcd2', 400: '#ee8a6c', 500: '#e76f51', 600: '#c95537', 700: '#9c3f27' },
        arena: { 50: '#fcfaf6', 100: '#f6f0e6', 200: '#ebe1d1', 300: '#d9cab2' },
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
