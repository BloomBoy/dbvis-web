module.exports = {
  extends: [
    'next/core-web-vitals',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    '@typescript-eslint/no-floating-promises': ['error'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@next/next/no-img-element': ['off'],
    'class-methods-use-this': ['off'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'always',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'either',
        depth: 25,
      },
    ],
    'no-void': ['error', { allowAsStatement: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allowAfterThis: true,
      },
    ],
    'react/jsx-props-no-spreading': ['off'],
    'react/no-danger': ['off'],
    'react/require-default-props': [
      'error',
      { ignoreFunctionalComponents: true, forbidDefaultForRequired: true },
    ],
    'sort-imports': [
      'error',
      {
        allowSeparatedGroups: true,
      },
    ],
  },
};
