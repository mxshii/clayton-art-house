/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clayton: {
          canvas: {
            DEFAULT: '#FDFCFA',
            warm: '#FAF7F2',
          },
          umber: {
            DEFAULT: '#28231F',
            soft: '#3E3731',
            muted: '#5C544D',
            light: '#8C8277',
          },
          sienna: {
            DEFAULT: '#577057',
            hover: '#425141',
            dark: '#172F17',
            light: '#EFF3EE',
            tint: '#F6F3EF',
          },
          terracotta: {
            DEFAULT: '#577057',
            hover: '#425141',
            dark: '#172F17',
            light: '#EFF3EE',
            tint: '#F6F3EF',
          },
          parchment: {
            DEFAULT: '#FAF7F2',
            surface: '#FFFFFF',
            warm: '#F2ECE1',
            card: '#FFFFFF',
          },
          linen: {
            DEFAULT: '#FAF7F2',
            surface: '#FFFFFF',
          },
          patina: {
            DEFAULT: '#4E5F4D',
            dark: '#3A4839',
            light: '#EFF3EE',
          },
          olive: {
            DEFAULT: '#4E5F4D',
            dark: '#3A4839',
            light: '#EFF3EE',
          },
          sand: {
            DEFAULT: '#E5D2C2',
            light: '#F6F3EF',
            warm: '#E8E0DC',
          },
          green: {
            DEFAULT: '#577057',
            dark: '#425141',
            deep: '#172F17',
            light: '#EFF3EE',
          },
          ochre: {
            DEFAULT: '#DFA363',
            hover: '#c98e4e',
            light: '#FBF5EE',
          },
          clay: {
            DEFAULT: '#D2825C',
            soft: '#CE9781',
          },
          hairline: '#EAE4D8',
          border: {
            DEFAULT: '#E8E2D6',
            subtle: '#EFEAE0',
            dark: '#28231F',
          },
        },
      },
      fontFamily: {
        montserrat: ['"Montserrat"', 'sans-serif'],
        courgette: ['"Courgette"', 'cursive'],
        cairo: ['"Cairo"', 'sans-serif'],
        sans: ['"Montserrat"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Montserrat"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'curatorial': '0.22em',
        'loose-editorial': '0.15em',
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(33, 28, 24, 0.04)',
        'warm-md': '0 4px 16px rgba(33, 28, 24, 0.06)',
        'warm-lg': '0 12px 32px rgba(33, 28, 24, 0.08)',
        'editorial': '0 20px 50px rgba(33, 28, 24, 0.1)',
        'clayton-card': '5px 5px 40px 0px rgba(21, 21, 21, 0.08)',
        'clayton-btn': '5px 5px 40px 0px rgba(0, 0, 0, 0.20)',
      }
    },
  },
  plugins: [],
}
