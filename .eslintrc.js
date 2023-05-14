/**
 * This config is used when you run `lint` or `lint:fix`.
 * It is basic, adjust as you see fit! You can of course use your own configuration.
 * @see https://eslint.org/
 */
module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    `eslint:recommended`,
    `plugin:@typescript-eslint/recommended`,
    `plugin:prettier/recommended`,
  ],
  parser: `@typescript-eslint/parser`,
  plugins: [`@typescript-eslint`, `prettier`],
  root: true,
  rules: {
    "@typescript-eslint/array-type": [`error`, { default: `generic` }],
  },
};
