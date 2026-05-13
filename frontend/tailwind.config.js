/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        qing: {
          400: '#7bc3db',
          500: '#6ab3cb',
          600: '#5a9eb5',
        },
        chi: {
          400: '#ae3136',
          500: '#9a2a2f',
          600: '#862328',
        },
        huang: {
          400: '#f3d769',
          500: '#e8c954',
          600: '#d4b84a',
        },
        bai: {
          400: '#f5f1ee',
          500: '#ede8e4',
          600: '#e0dbd6',
        },
        hei: {
          400: '#2e2e33',
          500: '#232328',
          600: '#1a1a1e',
        },
      },
    },
  },
  darkMode: "class",
};
