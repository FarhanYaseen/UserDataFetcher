module.exports = {
  preset: 'ts-jest', // Use ts-jest for TypeScript
  testEnvironment: 'node', // Node.js test environment
  testMatch: ['**/tests/**/*.test.ts'], // Look for test files in tests directory
  moduleFileExtensions: ['ts', 'js'], // Recognize these extensions
  moduleDirectories: ['node_modules', 'src'], // Allow Jest to find these directories
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'], // Ensure node_modules is ignored
  collectCoverage: true, // Optional: Collect test coverage
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};
