/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust to your file structure
  ],
  theme: {
    extend: {
      keyframes: {
        zoom: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        zoom: "zoom 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
