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
        accent: {
          primary: "#592483",
          secondary: "#252525",
          danger: "#F45050",
          stroke: "#343232",
        },
      },
    },
  },
  plugins: [],
};
