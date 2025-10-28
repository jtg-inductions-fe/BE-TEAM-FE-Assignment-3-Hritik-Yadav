export default {
  // Use ts-jest as the preset
  preset: "ts-jest",

  testEnvironment: "jest-environment-jsdom",

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // This tells Jest to transpile antd (and other ESM-only packages)
  transformIgnorePatterns: [
    '/node_modules/(?!antd|@ant-design|rc-util|rc-pagination|rc-picker|rc-tree|rc-table)/',
  ],

  // Tell Jest how to handle file imports (like Webpack does)
  moduleNameMapper: {
    // Mock CSS/SCSS/LESS modules to prevent errors
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",

    // This mocks antd's global CSS imports
    'antd/dist/reset.css': '<rootDir>/__mocks__/fileMock.js',

    '^@/(.*)$': '<rootDir>/src/$1',
    
  },
};
