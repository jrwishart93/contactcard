// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        blue: {
          600: '#2563EB',
          700: '#1D4ED8',
        },
        primary: '#005EA5',
      },
    },
  },
  plugins: [],
};
