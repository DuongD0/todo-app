module.exports = {
  files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
  plugins: {
    "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    "react-native": require("eslint-plugin-react-native"),
  },
  rules: {
    "react-native/no-unused-styles": "error",
    "react-native/split-platform-components": "error",
    "react-native/no-inline-styles": "warn",
    "react-native/no-color-literals": "warn",
  },
};

