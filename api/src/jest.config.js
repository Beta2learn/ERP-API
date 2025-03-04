module.exports = {
    preset: 'ts-jest', // Use ts-jest preset for TypeScript support
    testEnvironment: 'node', // Set the environment to Node.js
    transform: {
      '^.+\\.ts$': 'ts-jest', // Transform .ts files using ts-jest
    },
    testMatch: ['**/*.test.ts', '**/*.spec.ts'], // Pattern for Jest to find test files
    globals: {
      'ts-jest': {
        isolatedModules: true, // Enable isolated modules for better performance with ts-jest
      },
    },
  };
  