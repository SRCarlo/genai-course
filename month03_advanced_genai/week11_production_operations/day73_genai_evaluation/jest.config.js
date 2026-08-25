export default {
  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.js"],

  transform: {},

  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
};
