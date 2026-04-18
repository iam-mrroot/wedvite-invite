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
        gold: {
          50: '#FBF7EF',
          100: '#F5EBDA',
          200: '#ECDBB8',
          300: '#D4B978',
          400: '#C9A84C',
          500: '#B8941F',
          600: '#9A7B18',
          700: '#7A6113',
          800: '#5C490F',
          900: '#3E310A',
        },
        cream: '#FAF6F0',
        charcoal: '#1C1C1C',
        warmgray: '#6B6560',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
