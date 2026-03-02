/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'aj-yellow': '#FFD700',
        'aj-green': '#2D5016',
        'aj-dark': '#0A0A0A',
      },
    },
  },
  plugins: [],
}
