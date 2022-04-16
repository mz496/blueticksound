module.exports = {
  content: ["./**/*.html"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
      backgroundImage: {
        'bluetick': "url('/static/img/bluetick-bg-3950-2800.jpeg')",
      },
      fontFamily: {
        'rubik-mono-one': ['"Rubik Mono One"', 'sans-serif']
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
