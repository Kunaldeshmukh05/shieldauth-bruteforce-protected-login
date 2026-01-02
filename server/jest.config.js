module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/database.js',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  testTimeout: 10000,
};