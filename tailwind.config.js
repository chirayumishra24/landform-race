/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        teamBlue: {
          light: "#38bdf8",
          DEFAULT: "#0284c7",
          dark: "#0369a1",
          deep: "#0c4a6e",
          glow: "rgba(14, 165, 233, 0.45)",
        },
        teamOrange: {
          light: "#fb923c",
          DEFAULT: "#f97316",
          dark: "#c2410c",
          deep: "#7c2d12",
          glow: "rgba(249, 115, 22, 0.45)",
        },
      },
      boxShadow: {
        'clay-card': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        'clay-btn-blue': '0 8px 20px -4px rgba(2, 132, 199, 0.5), 0 2px 4px 0 rgba(255, 255, 255, 0.5) inset',
        'clay-btn-orange': '0 8px 20px -4px rgba(249, 115, 22, 0.5), 0 2px 4px 0 rgba(255, 255, 255, 0.5) inset',
        'clay-sm': '0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(255, 255, 255, 0.8) inset',
        'soft-glow': '0 0 30px rgba(56, 189, 248, 0.25)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
};
