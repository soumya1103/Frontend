module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/", // Allow axios to be transpiled
  ],
  testEnvironment: "jsdom", // This ensures a browser-like environment if needed
};

module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  // other Jest configurations
};

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/Pages/Categories/**/*.{js,jsx}", // Include only files from the categories module
  ],
  coverageDirectory: "coverage", // Specify where to save the coverage report
  coverageReporters: ["html", "text"], // Specify the type of coverage reports you want
};
