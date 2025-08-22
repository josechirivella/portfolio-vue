import plugin from 'tailwindcss/plugin';

export default {
  content: [
    './app/components/**/*.{vue,js}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './content/**/*.md',
  ],
  plugins: [
    require('tailwindcss-primeui'),
    require('@tailwindcss/typography'),
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: { fontSize: theme('fontSize.2xl') },
        h2: { fontSize: theme('fontSize.xl') },
        h3: { fontSize: theme('fontSize.lg') },
      });
    }),
  ],
};
