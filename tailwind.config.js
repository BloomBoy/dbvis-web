/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

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
      colors: {},
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
