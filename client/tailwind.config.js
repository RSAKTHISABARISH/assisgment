/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60A5FA',
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
        },
        secondary: {
          light: '#F3F4F6',
          DEFAULT: '#E5E7EB',
          dark: '#374151',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
