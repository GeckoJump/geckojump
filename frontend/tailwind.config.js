/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'background': '#111827',
        'pallete-1': '#0f5a75',
        'pallete-2': '#00a9b2',
        'pallete-3': '#71faca'
      },
      fontFamily: {
        sans: ['HelveticaNow', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        BebasNeue: ['BebasNeue-Regular', 'sans-serif']
      }
    },
  },
  plugins: [],
}

