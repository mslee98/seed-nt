import seedPlugin from '@seed-design/tailwind3-plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './seed-design/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        desktop: '1024px',
      },
    },
  },
  plugins: [seedPlugin],
}
