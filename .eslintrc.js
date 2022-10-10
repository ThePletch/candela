module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": ["error", {
      functions: "defaultArguments",
    }]
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [".ts", ".tsx"],
    },
  },
};
