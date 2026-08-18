/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        school: '#0D9488',
        pathway: '#9333EA',
        sen: '#E11D48',
        culture: '#EA580C',
        success: '#10B981',
      },
      fontSize: {
        xxs: '0.7rem',
      },
    },
  },
  plugins: [],
};
