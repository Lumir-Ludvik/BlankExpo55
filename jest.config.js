/** @type {import('jest').Config} */
const config = {
  preset: "jest-expo",
  transformIgnorePatterns: ["node_modules/(?!@gluestack-ui)/"],
};

module.exports = config;
