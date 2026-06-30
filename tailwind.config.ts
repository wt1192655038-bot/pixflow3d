import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: "#080b12",
          panel: "#111827",
          panel2: "#172033",
          line: "#263244",
          blue: "#38bdf8",
          blue2: "#2563eb"
        }
      }
    }
  },
  plugins: []
};

export default config;
