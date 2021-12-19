module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
    'jest/globals': true,
  },
  extends: ['airbnb'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    semi: ['error', 'never'],
    'no-await-in-loop': 'off',
    'no-console': 'off',
    'operator-linebreak': 'off',
    'prefer-destructuring': 'off',
  },
}
