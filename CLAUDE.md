# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses **bun** as the package manager, used to be with **pnpm**.

### Common Commands

- `bun dev` - Start development server with hot reload at localhost:3000
- `bun build` - Build for production
- `bun generate` - Generate static site
- `bun start` - Start production server
- `bun preview` - Preview production build
- `bun test` - Run Vitest tests
- `bun lint` - Run both ESLint and Stylelint (combines `bun lint:js && bun lint:style`)
- `bun lint:js` - Run ESLint only
- `bun lint:style` - Run Stylelint for Vue, CSS, and SCSS files

### Testing

- Tests are located in the `test/` directory using Vitest with Vue Test Utils
- Component tests are in `test/components/`
- Page tests are in `test/pages/`
- Vitest snapshots are used for component testing
- Run `bun --bun test` to execute all tests

## Architecture Overview

This is a **Nuxt 3** portfolio website with the following key characteristics:

### Tech Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API and TypeScript
- **Styling**: Tailwind CSS + SCSS with PrimeVue component library using custom "Noir" theme
- **Content**: Nuxt Content module for markdown blog posts
- **Icons**: Nuxt Icon module with FontAwesome icons
- **Analytics**: PostHog integration
- **Error Tracking**: PostHog integration
- **Testing**: Vitest with Vue Test Utils

### Project Structure

- `app/components/` - Vue components (Btn, Hero, Nav, Footer, Contact, blog components)
- `app/pages/` - File-based routing (index.vue, about.vue, blog/)
- `content/blog/` - Markdown blog posts
- `app/layouts/` - Layout components (default.vue)
- `app/plugins/` - Client-side plugins (posthog.client.js)
- `server/routes/` - Server routes (sitemap.xml.ts)
- `assets/` - SCSS stylesheets
- `public/` - Static assets

### Key Configuration

- **Nuxt Config**: Custom PrimeVue theme, SSR enabled, view transitions experimental feature
- **Content Highlighting**: One Dark Pro theme for code blocks
- **Prerendering**: Static generation for `/` and `/sitemap.xml` with link crawling
- **TypeScript**: Fully typed with strict configuration

### Component Patterns

- Uses Vue 3 Composition API with `<script setup>`
- Component imports use `@/components/` alias
- Icon components use `fa-brands:` and `fa6-regular:` prefixes for FontAwesome
- Tailwind utility classes for styling with responsive design

### Blog System

- Markdown files in `content/blog/` directory
- Blog posts use frontmatter for metadata
- Dynamic routing via `app/pages/blog/[...slug].vue`
- Table of contents and reading progress components available
- Tag system for categorization

### Code Quality

- ESLint configuration with Nuxt and Vitest plugins
- Stylelint for CSS/SCSS/Vue style validation
- Husky + lint-staged for pre-commit hooks
- Commitlint for conventional commit messages
- Prettier for code formatting
