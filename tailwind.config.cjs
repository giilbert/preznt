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
        mono: ["Roboto Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        background: {
          primary: "#111111",
          secondary: "#1a1a1a",
          tint: "#0d0d0d",
        },
        foreground: { primary: "#efefef", secondary: "#dddddd" },
        accent: {
          primary: "#0077b6",
          secondary: "#5b7280",
          danger: "#F45050",
          stroke: "#23232e",
        },
        neutral: {
          850: "#1f1f1f",
        },
      },
    },
  },
  plugins: [],
};
