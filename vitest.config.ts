import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    coverage: { reporter: ['text', 'json', 'html'] },
  },
});
