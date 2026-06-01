/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        lagoon: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#06B6D4',
          900: '#164E63',
        },
      },
    },
  },
  plugins: [],
};
