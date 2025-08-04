/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#8BC34A',
        accent: '#CDDC39',
        background: '#F0F4C3',
        text: '#212121',
        darkGreen: '#18392B', /* Sea Green */
        lightGreen: '#0F5132', /* Light Green */
        accentGreen: '#0A5C36', /* Green */
        darkBrown: '#8B4513', /* Saddle Brown */
        lightBrown: '#D2B48C', /* Tan */
        cream: '#F5F5DC', /* Beige */
        deepGreen: '#1D2E28', /* Darker Green */
        gradientLight: '#0F5132' /* Slightly darker shade for gradient */
      },
    },
  },
  plugins: [],

}

