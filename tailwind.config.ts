import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        white: "#fff",
        black: "#000",

        background: "var(--background)",
        foreground: "var(--foreground)",
        red: "var(--red)",
      },
    },
  },
  plugins: [],
};

export default config;
