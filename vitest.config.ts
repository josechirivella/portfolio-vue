import { defineVitestProject } from '@nuxt/test-utils/config';
import { defineConfig } from 'vitest/config';

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
      // Plain-node tests for server/ utilities. "environment" here is Vitest's *test*
      // environment, not the JS runtime -- these are pure functions that need neither a
      // DOM nor a booted Nuxt app, so running them outside the nuxt environment keeps
      // them fast and lets them import from server/ directly.
      {
        test: {
          name: 'server',
          include: ['test/server/**/*.spec.ts'],
          environment: 'node',
        },
      },
    ],
  },
});
