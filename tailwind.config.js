/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        max_height: "max-height",
      },
      colors: {
        "custom-blue": "#f2f2f2",
      },
    },
  },
  plugins: [],
};
