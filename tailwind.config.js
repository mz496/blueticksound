module.exports = {
  content: ["./**/*.html"],
  theme: {
    container: {
      center: true,
    },
    screens: {
      '2xl': '1536px',
      'max-2xl': {'max': '1535px'},
      'xl': '1280px',
      'max-xl': {'max': '1279px'},
      'lg': '1024px',
      'max-lg': {'max': '1023px'},
      'md': '768px',
      'max-md': {'max': '767px'},
      'sm': '640px',
      'max-sm': {'max': '639px'},
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
