import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#080b11",
        surface: {
          50: "#182030",
          100: "#121824",
          200: "#0d121c",
          300: "#090d15",
        },
        brand: {
          cyan: "#06b6d4",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          amber: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-dark": "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 35%, transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(6, 182, 212, 0.3)",
        "glow-purple": "0 0 25px -5px rgba(139, 92, 246, 0.3)",
        "glow-amber": "0 0 25px -5px rgba(245, 158, 11, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
