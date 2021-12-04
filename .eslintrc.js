const tsconfig = __dirname + "/tsconfig.json";

module.exports = {
  env: {
    node: true,
    amd: true,
  },
  parser: "@typescript-eslint/parser",
  settings: {
    "import/resolver": {
      typescript: {
        // Required for certain syntax usages
        ecmaVersion: 2017,
        project: [tsconfig],
      },
    },
  },
  root: true,
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["dist/*", "node_modules/*"],
  rules: {},
};
