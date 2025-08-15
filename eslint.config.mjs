import eslintConfigPrettier from 'eslint-config-prettier';
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import vitest from '@vitest/eslint-plugin';

export default withNuxt(
  eslintConfigPrettier,
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
    ignores: ['node_modules', '.nuxt', 'dist', 'public'],
  },
  {
    files: ['test/**/*.spec.js'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
);
