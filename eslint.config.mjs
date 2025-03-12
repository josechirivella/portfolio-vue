import eslintConfigPrettier from 'eslint-config-prettier';
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import pluginJest from 'eslint-plugin-jest';

export default withNuxt(
  eslintConfigPrettier,
  pluginJest.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
    ignores: ['node_modules', '.nuxt', 'dist', 'public'],
  },
);
