import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    projects: [
      // Nuxt environment tests - for components, pages, and composables
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/**/*.nuxt.spec.js'],
          environment: 'nuxt',
        },
      }),
    ],
  },
});
