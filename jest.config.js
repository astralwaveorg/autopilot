module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'scripts/**/*.ts',
    'scripts/**/*.js',
    '!scripts/**/*.test.ts',
    '!scripts/**/*.test.js',
    '!scripts/templates/**',
    '!scripts/storage/**',
  ],
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 10000,
};
