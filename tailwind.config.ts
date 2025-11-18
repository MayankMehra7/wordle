import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        correct: '#6aaa64',
        present: '#c9b458',
        absent: '#787c7e',
        empty: '#ffffff',
      },
    },
  },
  plugins: [],
};
export default config;
