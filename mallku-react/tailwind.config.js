/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mallku-green': '#39FF14',
        'mallku-dark': '#0a0a0a',
      },
    },
  },
  plugins: [],
}

