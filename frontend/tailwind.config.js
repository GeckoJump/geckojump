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
      },
      variants: {
        extend: {
          rotateY: ['group-focus'],
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}

