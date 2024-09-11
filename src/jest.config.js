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
