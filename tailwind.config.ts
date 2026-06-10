import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0A',
        charcoal: '#141414',
        slate: '#1E1E1E',
        gold: '#C9A84C',
        'gold-light': '#E8C97A',
        ivory: '#F5F0E8',
        mist: '#9A9A9A',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { '0%': {opacity:'0',transform:'translateY(24px)'}, '100%': {opacity:'1',transform:'translateY(0)'} },
        fadeIn: { '0%': {opacity:'0'}, '100%': {opacity:'1'} },
        shimmer: { '0%': {backgroundPosition:'-200% 0'}, '100%': {backgroundPosition:'200% 0'} },
        float: { '0%,100%': {transform:'translateY(0px)'}, '50%': {transform:'translateY(-8px)'} },
      }
    },
  },
  plugins: [],
}
export default config
