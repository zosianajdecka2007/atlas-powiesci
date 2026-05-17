import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f7f2ea",
        porcelain: "#fffdfa",
        graphite: "#242424",
        ink: "#111111",
        navy: "#263247",
        wine: "#8f3147",
        sage: "#6f7f72",
        amber: "#b58145"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 17, 17, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
