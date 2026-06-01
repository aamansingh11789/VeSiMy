import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vs: {
          navy:  { 950:"#071A2F", 900:"#0B1D33", 800:"#0F2747", 700:"#163A5F" },
          blue:  { 700:"#2F5D8A", 600:"#3A6FA3", 500:"#4A83BC" },
          slate: { 700:"#4F6174", 600:"#73879C", 400:"#A9B5C2", 200:"#DDE3EA", 100:"#EEF2F6" },
          gold:  { 600:"#C9A66B", 500:"#D9C08A", 300:"#E8D8B5" },
          sand:  { 100:"#F7F3EA" },
          paper:   "#F7F8FA",
          white:   "#FFFFFF",
          success: "#2F8F6B",
          warning: "#D99A3D",
          danger:  "#C94F4F",
          info:    "#2F76D2",
        },
        // Legacy aliases (so old code still compiles)
        brand:  "#0B1D33",
        amber:  "#C9A66B",
      },
      fontFamily: {
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
        serif:   ["Instrument Serif", "Georgia", "serif"],
      },
      borderRadius: {
        vsSm:"8px", vsMd:"12px", vsLg:"16px", vsXl:"22px",
      },
      boxShadow: {
        vsCard:  "0 10px 30px rgba(7, 26, 47, 0.06)",
        vsPanel: "0 18px 50px rgba(7, 26, 47, 0.12)",
        vsDark:  "0 18px 60px rgba(7, 26, 47, 0.35)",
      },
    },
  },
  plugins: [],
}
export default config
