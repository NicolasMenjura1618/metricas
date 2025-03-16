module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!(axios|react-toastify)/)"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.js"
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!src/reportWebVitals.js",
    "!src/**/*.d.ts"
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 90,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ["text", "lcov", "html"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx}"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js"
  }
}
