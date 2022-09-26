/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const brandPrimaryColors = {
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

brandPrimaryColors.DEFAULT = brandPrimaryColors[500];

module.exports = {
  content: [
    path.join(__dirname, 'src', 'components', '**', '*.{js,ts,jsx,tsx}'),
    path.join(__dirname, 'src', 'pages', '**', '*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: brandPrimaryColors,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
