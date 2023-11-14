module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:preact/recommended",
    // "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    // configure resolver for symbolic TS paths
    "import/resolver": {
      typescript: {
        project: ["tsconfig.json", "packages/**/tsconfig.json"],
      },
    },
  },
  rules: {
    // automatically sort imports
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        alphabetize: { order: "asc" },
      },
    ],
    // relaxed unused var errors
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        // ignoreRestSiblings: true,
      },
    ],
  },
  ignorePatterns: [".eslintrc.js", "dist"],
};
