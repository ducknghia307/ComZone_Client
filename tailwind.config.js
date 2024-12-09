import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    screens: {
      phone: "431px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
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
