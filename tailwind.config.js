/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      'sm': '576px',
      'md': '960px',
      'lg': '1440px',
    },
    extend: {
      boxShadow: {
        '3xl': '10px 10px 80px 20px 20px rgba(0, 0, 0, 0.3)',
      },
    }
  },
  plugins: [],
}