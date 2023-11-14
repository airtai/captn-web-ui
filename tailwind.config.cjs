/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      'rba-yellow': '#f7ff00',
      'captn-dark-blue': '#003851',
      'rba-dark-gray': '#34393c',
      'rba-light-gray':'#f7f7f7',
      'captn-cta-green': '#0da37f',
      'captn-cta-red': '#e57373',
      'captn-cta-green-hover': '#066d55',
      'captn-cta-red-hover': '#ef5350',
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};