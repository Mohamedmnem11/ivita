module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
 
  theme: {
  extend: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--secondary-color)",
      accent: "var(--color-accent)",
      error: "var(--color-error)",
      text: "var(--color-text)",
    },
    borderRadius: {
      base: "var(--border-radius)",
    },
  },
},

  plugins: [],
};

