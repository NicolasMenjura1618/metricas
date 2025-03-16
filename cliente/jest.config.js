module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest"

  },
  moduleFileExtensions: ["js", "jsx"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "/node_modules/" // Transform all node modules
  ]




};
