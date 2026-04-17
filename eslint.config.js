const reactNativeConfig = require("@react-native/eslint-config/flat");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

const reactNativeConfigWithoutFlow = reactNativeConfig.filter(
  block => !block.plugins || !block.plugins["ft-flow"],
);

module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "build/**",
      "android/**",
      "ios/**",
      "coverage/**",
    ],
  },
  ...reactNativeConfigWithoutFlow,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: false,
          bracketSameLine: true,
          trailingComma: "all",
          arrowParens: "avoid",
        },
      ],
      semi: ["error", "always"],
      quotes: [
        "error",
        "double",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      curly: ["error", "all"],
    },
  },
];
