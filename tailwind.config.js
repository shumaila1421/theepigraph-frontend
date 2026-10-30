/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F6F3",
        ink: "#23262B",
        night: "#1F2C2A",
        muted: "#757A82",
        line: "#E2E2DD",
        pine: { DEFAULT: "#33504B", dark: "#283F3B", soft: "#E8EDEB" },
        clay: "#8C4A4A",
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Hanken Grotesk", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
