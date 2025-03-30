module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "/node_modules/"
  ],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  reporters: [
    "default",
    "jest-spec-reporter",
    // [
    //   "jest-html-reporter",
    //   {
    //     pageTitle: "Test Report",
    //     outputPath: "test-report.html",
    //     includeFailureMsg: true,
    //     suppressErrorSummary: true,
    //     suppressGlobalSummary: false,
    //     theme: "lightTheme",
    //   }
    // ],

    [
      "jest-junit",
      {
        outputDirectory: "./reports/junit",
        outputName: "junit.xml",
      }
    ]
  ],
  verbose: true,
  coverageReporters: ["text", "lcov"],
  collectCoverage: true,
};
