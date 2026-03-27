import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vesimy tempered metal palette
        'oc-bg':      '#03030D',
        'oc-bg2':     '#080818',
        'oc-bg3':     '#0D0D22',
        'oc-border':  '#1A1A40',
        'oc-gold':    '#0176D3',
        'oc-gold2':   '#F4A623',
        'oc-violet':  '#6426A0',
        'oc-violet2': '#8C44CC',
        'oc-steel':   '#6CB9FC',
        'oc-steel2':  '#1090D4',
      },
      fontFamily: {
        serif: ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'Georgia', 'serif'],
        sans:  ['Inter', '-apple-system', 'Arial', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'metal-gradient': 'linear-gradient(135deg, #0176D3, #AC3A5A, #6426A0, #1060D4, #6CB9FC)',
      },
      boxShadow: {
        'gold-glow': '0 0 24px rgba(1,118,211,0.28)',
        'violet-glow': '0 0 24px rgba(100,38,160,0.22)',
      },
    },
  },
  plugins: [],
}
export default config
