/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "spotify-green": "#1DB954",
      "spotify-black": "#191414",
      "spotify-white": "#FFFFFF"
    },
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["dark", "dark"],
  },
}

