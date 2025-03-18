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
        primary: {
          DEFAULT: '#338159',
          dark: '#276647',
          light: '#4a9d75',
        },
        secondary: {
          DEFAULT: '#002eb8',
          dark: '#00259a',
          light: '#1a47d1',
        },
        background: '#f4f4f9',
        text: '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
