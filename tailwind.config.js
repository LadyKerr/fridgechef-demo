/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D2691E', // Chocolate/terracotta
        secondary: '#FF6B47', // Coral red
        accent: '#FFB347', // Peach/golden yellow
        background: '#FFF8F0', // Warm cream
        warmGray: '#8B7355', // Warm brown-gray
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
