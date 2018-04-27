module.exports = {
  extends: 'standard',
  rules: {
    'comma-dangle': [2, 'only-multiline'],
    'no-unused-vars': 1,
    'semi': [2, 'always'],
  },
  plugins: [
    'mocha',
  ],
  env: {
    mocha: true,
  },
};
