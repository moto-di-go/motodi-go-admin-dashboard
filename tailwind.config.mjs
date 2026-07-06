/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        muted: "#627089",
        line: "#d9e0ea",
        surface: "#f6f8fb",
        brand: {
          50: "#ecfdf4",
          100: "#d1fae5",
          500: "#10b981",
          700: "#047857",
          900: "#064e3b"
        }
      },
      boxShadow: {
        panel: "0 12px 30px rgba(24, 33, 47, 0.08)"
      }
    }
  },
  plugins: []
};

