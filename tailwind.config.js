/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Arial', 
          'Helvetica', 
          'sans-serif'
        ],
        serif: [
          'Crimson Pro',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
        mono: [
          'Consolas', 
          'monaco', 
          'monospace'
        ],
      },
    },
  },
  plugins: [],
}