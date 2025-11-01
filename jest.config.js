export default {
  // Use ts-jest as the preset
  preset: "ts-jest",

  testEnvironment: "jest-environment-jsdom",

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // This tells Jest to transpile antd (and other ESM-only packages)
  transformIgnorePatterns: [
    "/node_modules/(?!antd|@ant-design|rc-util|rc-pagination|rc-picker|rc-tree|rc-table)/",
  ],

  // Tell Jest how to handle file imports (like Webpack does)
  moduleNameMapper: {
    // Mock SCSS modules to prevent errors
    "\\.(scss)$": "identity-obj-proxy",

    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@containers/(.*)$": "<rootDir>/src/containers/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
  },
};
