/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      {
        mydark: {
          primary: "#32805c",
          secondary: "#7c3aed",
          accent: "#f59e0b",
          neutral: "#111B22",
          "base-100": "#1B2832",
          info: "#00ffff",
          success: "#4ade80",
          warning: "#fde047",
          error: "#E5484D",

          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "2rem",
          "--border-btn": "1px",
        },
      },
    ],
  },
};
