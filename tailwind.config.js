/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede5',
          200: '#c5dccd',
          300: '#9bc2aa',
          400: '#6ea483',
          500: '#4c8663',
          600: '#396b4e',
          700: '#2e563f',
          800: '#274635',
          900: '#173625', // Primary Deep Forest Green
          950: '#0d1f15',
        },
        sage: {
          50: '#f5f7f5',
          100: '#e8ece8',
          200: '#d3dbd3',
          300: '#b4c3b5',
          400: '#8ea893', // Soft Sage Green
          500: '#718c76',
          600: '#58705d',
          700: '#47594b',
          800: '#3b493e',
          900: '#323d35',
        },
        cream: {
          50: '#fdfcfb',
          100: '#faf7f2', // Warm Cream Background
          200: '#f5efe4',
          300: '#ede4d1',
          400: '#e2d3b8',
        },
        sand: {
          50: '#faf8f5',
          100: '#f3efe6',
          200: '#e7e0d3',
          300: '#d7cbba',
          400: '#c3b19b',
        },
        charcoal: {
          50: '#f6f7f6',
          100: '#e2e5e3',
          200: '#c5cbcf',
          400: '#6e7a72',
          500: '#556058',
          600: '#444d47',
          700: '#343c37',
          800: '#2a312c',
          900: '#1e2421', // Dark Charcoal text
          950: '#121614',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(23, 54, 37, 0.06)',
        'card': '0 10px 30px -4px rgba(23, 54, 37, 0.08)',
        'elevated': '0 20px 40px -8px rgba(23, 54, 37, 0.12)',
      },
    },
  },
  plugins: [],
};
