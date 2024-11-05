import eslintConfigPrettier from 'eslint-config-prettier';
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
    ignores: ['node_modules', '.nuxt', 'dist', 'public'],
  },
  eslintConfigPrettier
)
