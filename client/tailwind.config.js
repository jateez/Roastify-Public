/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "spotify-green": "#1DB954",
      'spotify-light-green': '#1ED760',
      "spotify-black": "#191414",
      'spotify-dark-gray': '#282828',
      "spotify-white": "#FFFFFF",
      "spotify-off-white": "#FAF9F6"
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

