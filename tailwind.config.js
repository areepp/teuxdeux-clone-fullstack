/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Oswald', ...defaultTheme.fontFamily.sans],
        gothic: ['AlternateGothic', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
