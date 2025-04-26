module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    // "linebreak-style": ["error", "unix"],
    // "max-len": ["error", { code: 220 }],
    // indent: ["error", "tab"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
};
