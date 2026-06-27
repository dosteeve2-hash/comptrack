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
        ct: {
          bg: "#0d1117",
          bg2: "#161b22",
          bg3: "#1c2333",
          border: "#21262d",
          border2: "#30363d",
          text: "#e6edf3",
          text2: "#8b949e",
          text3: "#4e5f82",
          green: "#22c55e",
          green2: "#16a34a",
          blue: "#3b82f6",
          blue2: "#2563eb",
          red: "#ef4444",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
