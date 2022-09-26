module.exports = {
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'always',
        mjs: 'always',
        cjs: 'always',
      },
    ],
  },
};
