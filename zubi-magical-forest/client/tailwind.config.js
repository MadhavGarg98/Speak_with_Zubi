/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forestDark: "#0C1F17",
        forestMid: "#1F4D3A",
        goldAccent: "#F4C95D",
        emeraldAccent: "#3DAE74",
        creamText: "#FDF6E3",
      },
      boxShadow: {
        magical: "0 0 30px rgba(244, 201, 93, 0.6)",
      },
      animation: {
        pulseGlow: "pulseGlow 2s infinite",
        sparkle: "sparkle 1.5s ease-out",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 10px #F4C95D" },
          "50%": { boxShadow: "0 0 25px #FFD86B" },
        },
        sparkle: {
          "0%": { opacity: 1, transform: "scale(0.5)" },
          "100%": { opacity: 0, transform: "scale(2)" },
        },
      },
    },
  },
  plugins: [],
}
