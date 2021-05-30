module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb', 'prettier', 'plugin:node/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
      },
    ],
    'no-console': 'off',
    'import/newline-after-import': 'off',
    curly: 2,
    'no-unused-vars': 'warn',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
  },
};
