/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kiln: {
          bg: "#0d0d0d",
          panel: "#111111",
          muted: "#9ca3af",
          celadon: "#70a19f",
          celadonSoft: "#a8c6b1",
          fire: "#d97706",
          fireGlow: "#fb923c",
        },
      },
      fontFamily: {
        serif: ["'Noto Serif SC'", "Songti SC", "SimSun", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        fire: "0 0 40px rgba(251, 146, 60, 0.35)",
        celadon: "0 0 60px rgba(112, 161, 159, 0.25)",
      },
      backgroundImage: {
        "radial-spot":
          "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(112,161,159,0.12), transparent 55%)",
        "radial-fire":
          "radial-gradient(ellipse 70% 50% at 70% 45%, rgba(217,119,6,0.18), transparent 60%)",
      },
    },
  },
  plugins: [],
};
