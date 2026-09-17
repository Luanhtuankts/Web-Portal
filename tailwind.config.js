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
          'var(--app-font)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        serif: [
          'Crimson Pro',
          'Georgia',
          'Times New Roman',
          'Cambria',
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