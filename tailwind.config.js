/** @type {import('tailwindcss').Config} */
module.exports = {	
  content: ["./src/**/*.{html,js}"],	
  theme: {
    extend: {},
  },
  daisyui: {
    themes: false,
  },
  plugins: [require("daisyui")],
}

