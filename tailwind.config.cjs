/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      "captn-light-blue": "#6faabc",
      "captn-dark-blue": "#003851",
      "captn-light-cream": "#eae4d9",
      "captn-cta-green": "#71ad3d",
      "captn-cta-red": "#e57373",
      "captn-cta-green-hover": "#9ac475",
      "captn-cta-red-hover": "#ef5350",
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
