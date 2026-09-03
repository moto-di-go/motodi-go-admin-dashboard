/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#14201c",
        muted: "#5c6f68",
        line: "#d5e0db",
        surface: "#f3f7f5",
        brand: {
          50: "#ecf8f1",
          100: "#d1f0df",
          500: "#12a86a",
          700: "#0b6e47",
          900: "#084830"
        }
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "Segoe UI", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Sora"', '"Source Sans 3"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"]
      },
      boxShadow: {
        panel: "0 1px 2px rgba(20, 32, 28, 0.04), 0 10px 28px rgba(20, 32, 28, 0.06)"
      }
    }
  },
  plugins: []
};
