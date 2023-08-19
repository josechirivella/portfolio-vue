/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '#app': '<rootDir>/node_modules/nuxt3/dist/app/index.mjs',
  },
  moduleFileExtensions: ['js', 'jsx', 'mjs', 'ts', 'vue'],
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '.+\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub',
    '.*\\.(vue)$': '@vue/vue3-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
  ],
  transformIgnorePatterns: ['node_modules/(?!(nuxt3|unenv))'],
  testEnvironment: 'jsdom',
  setupFiles: ['./test-utils/global-test-utils-config.ts'],
};
