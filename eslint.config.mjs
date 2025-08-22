import eslintConfigPrettier from 'eslint-config-prettier/flat';
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import vitest from '@vitest/eslint-plugin';

export default withNuxt(
  eslintConfigPrettier,
  {
    ignores: ['node_modules', '.nuxt', 'dist', 'public', 'coverage', '.data'],
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['test/**/*.spec.js'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
);
