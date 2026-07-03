import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2FA084",
          50:  "#f0faf6",
          100: "#dcf5ea",
          200: "#bbe9d5",
          300: "#88d7b7",
          400: "#52bf94",
          500: "#2FA084",
          600: "#217a63",
          700: "#1c6251",
          800: "#184f42",
          900: "#154137",
        },
        secondary: "#6FCF97",
        navy: {
          DEFAULT: "#0F1B2D",
          light:   "#1A2940",
          card:    "#111E33",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease",
        "slide-up":   "slideUp 0.3s ease",
        "spin-slow":  "spin 3s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        shimmer:      "shimmer 1.4s infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" },                                      to: { opacity: "1" } },
        slideUp: { from: { transform: "translateY(12px)", opacity: "0" },       to: { transform: "translateY(0)", opacity: "1" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" },                   "100%": { backgroundPosition: "400px 0" } },
      },
    },
  },
  plugins: [],
};

export default config;
