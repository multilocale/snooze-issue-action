module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: ['airbnb'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    semi: ['error', 'never'],
    'no-console': 'off',
    'operator-linebreak': 'off',
  },
}
