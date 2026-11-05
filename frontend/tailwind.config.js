/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cineda: {
          bg: '#08090a',
          surface: '#0f1115',
          card: '#14171d',
          kpi: '#0f1115',
          border: '#232832',
          borderSubtle: '#1e2229',
          hover: '#1a1e26',
          rowHover: '#181c24',
          accent: '#84cc16',
          lime: '#a3e635',
          text: '#f8fafc',
          muted: '#8b949e',
        }
      }
    },
  },
  plugins: [],
};
