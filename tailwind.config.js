/** @type {import('tailwindcss').Config} */

module.exports = {

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {

      colors: {

        instagram: {
          blue: '#4c5fd7',
          purple: '#7232bd',
          pink: '#f91d76',
          yellow: '#f99b4a',
          orange: '#ff4b3e',
        },
      },
      backgroundImage: {

        'instagram-gradient': "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      }
    },
  },
  plugins: [],
}