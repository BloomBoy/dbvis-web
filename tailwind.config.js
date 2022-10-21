/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
const path = require('path');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const brandPrimaryColors = {
  50: '#E9FEEC',
  100: '#D2FCD9',
  200: '#A7F9BD',
  300: '#79EEA3',
  400: '#55DD94',
  500: '#24C780',
  600: '#1AAB7A',
  700: '#128F71',
  800: '#0B7365',
  900: '#065F5C',
};

const brandGreyScale = {
  500: '#7B7B7B',
  900: '#2B2B2B',
};

brandPrimaryColors.DEFAULT = brandPrimaryColors[500];

module.exports = {
  content: [
    path.join(__dirname, 'src', 'components', '**', '*.{js,ts,jsx,tsx}'),
    path.join(__dirname, 'src', 'pages', '**', '*.{js,ts,jsx,tsx}'),
  ],
  // Tailwind statically analyze the codebase for used classes and generates
  // the CSS file based on that. These overrides are used to tell Tailwind
  // to always include certain classes that are used dynamically.
  safelist: [
    'text-start',
    'text-end',
    'text-center',
    'max-w-xs',
    'max-w-sm',
    'max-w-md',
    'max-w-lg',
    'max-w-xl',
    'max-w-2xl',
    'max-w-3xl',
    'max-w-4xl',
    'max-w-5xl',
    'max-w-6xl',
    'max-w-7xl',
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: brandPrimaryColors,
        bodyBackground: colors.white,
        grey: brandGreyScale,
      },
      typography: {
        DEFAULT: {
          css: {
            lineHeight: 1.2,
            color: colors.black,
            fontSize: '20px',
            fontWeight: 300,
            h1: {
              fontWeight: 400,
            },
            a: {
              color: brandPrimaryColors.DEFAULT,
              '&:hover': {
                color: brandPrimaryColors[700],
              },
            },
          },
        },
      },
    },
    fontFamily: {
      mono: ['jetbrainsmono', 'mono'],
      sans: ['AUTHENTIC Sans', ...defaultTheme.fontFamily.sans],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss'),
  ],
};
