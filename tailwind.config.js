/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx,html}',
    './docs/**/*.{js,jsx,ts,tsx,md,mdx,html}',
    './i18n/**/*.{js,jsx,ts,tsx,md,mdx,html}',
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              fontSize: theme('fontSize.2xl'), // specify your size
              fontWeight: theme('fontWeight.bold'), // specify your weight
            },
            h2: {
              fontSize: theme('fontSize.xl'),
              fontWeight: theme('fontWeight.bold'),
            },
            // Repeat for h3, h4, h5, h6
          },
        },
      }),
  

    },
  },
  plugins: [
  ],
}

