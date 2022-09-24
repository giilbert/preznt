// eslint-disable-next-line
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: { primary: "#171717", secondary: "#1d1d1d" },
        foreground: { primary: "#efefef", secondary: "#dddddd" },
        accent: {
          primary: "#0077b6",
          secondary: "#023e8a",
          danger: "#F45050",
          stroke: "#23232e",
        },
      },
    },
  },
  plugins: [],
};
