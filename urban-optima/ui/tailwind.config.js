// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Important: include all relevant file extensions here
  ],
  theme: {
    extend: {
      fontFamily: {
        Limelight: ['"Limelight"', 'sans-serif'],
        merienda: ['Merienda', 'cursive'],
        yatra: ['"Yatra One"', 'cursive'],
      },  
    },
  },
  plugins: [],
};
