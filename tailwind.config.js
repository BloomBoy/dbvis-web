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
  200: '#D8D7D7',
  300: '#F3F3F3',
  400: '#BFD6E2',
  500: '#7B7B7B',
  600: '#3B3F42',
  900: '#2B2B2B',
};

brandPrimaryColors.DEFAULT = brandPrimaryColors[500];
brandGreyScale.DEFAULT = brandGreyScale[500];

/**
 * @typedef {import('tailwindcss').Config} TailwindConfig
 */

/** @type {TailwindConfig} */
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
    'rounded-box',
    'no-box-padding',
    {
      pattern: /^max-w-.+/,
    },
    {
      pattern: /^gap-(?:x|y)-.+/,
    },
    {
      pattern: /^-?(?:m|p)(?:x|y|t|l|b|r)?-.+/,
    },
    {
      pattern: /^title-.+/,
      variants: ['sm', 'md', 'lg'],
    },
  ],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: brandPrimaryColors,
        bodyBackground: colors.white,
        grey: brandGreyScale,
        product: '#4BD068',
      },
      backgroundImage: {
        buttonBackground:
          'linear-gradient(360deg, #FCFCFC -48.75%, #F3F3F3 100%)',
      },
      boxShadow: {
        imageShadow: '0px 0px 6px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        card: '24px',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': `var(--contentful-text-color, ${colors.gray[700]})`,
            '--tw-prose-bold': `var(--contentful-text-color, ${colors.gray[900]})`,
            '--tw-prose-headings': `var(--contentful-text-color, ${colors.gray[900]})`,
            '--tw-prose-links': brandPrimaryColors.DEFAULT,
            '--tw-prose-links-hover': brandPrimaryColors[700],
            lineHeight: 1.2,
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: 300,
            h1: {
              fontWeight: 400,
            },
            h2: {
              fontWeight: 400,
              fontSize: '72px',
              lineHeight: '78px',
              letterSpacing: '-0.03em',
            },
            h3: {
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '28px',
            },
            'a:hover': {
              color: 'var(--tw-prose-links-hover)',
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
    require('./tailwindPlugins/titleComponent'),
  ],
};
