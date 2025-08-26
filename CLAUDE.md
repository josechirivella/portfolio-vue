# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses **pnpm** as the package manager, not npm or yarn.

### Common Commands

- `pnpm dev` - Start development server with hot reload at localhost:3000
- `pnpm build` - Build for production
- `pnpm generate` - Generate static site
- `pnpm start` - Start production server
- `pnpm preview` - Preview production build
- `pnpm test` - Run Vitest tests
- `pnpm lint` - Run both ESLint and Stylelint (combines `pnpm lint:js && pnpm lint:style`)
- `pnpm lint:js` - Run ESLint only
- `pnpm lint:style` - Run Stylelint for Vue, CSS, and SCSS files

### Database Commands

- `pnpm db:generate` - Generate new Drizzle migration files
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

### Local Development Commands

- `pnpm docker:up` - Start local PostgreSQL container
- `pnpm docker:down` - Stop local PostgreSQL container
- `pnpm docker:logs` - View PostgreSQL container logs
- `pnpm dev:local` - Start development server with local PostgreSQL database

### Testing

- Tests are located in the `test/` directory using Vitest with Vue Test Utils
- Component tests are in `test/components/`
- Page tests are in `test/pages/`
- Vitest snapshots are used for component testing
- Run `pnpm test` to execute all tests

## Architecture Overview

This is a **Nuxt 3** portfolio website with the following key characteristics:

### Tech Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API and TypeScript
- **Styling**: Tailwind CSS + SCSS with PrimeVue component library using custom "Noir" theme
- **Content**: Nuxt Content module for markdown blog posts
- **Icons**: Nuxt Icon module with FontAwesome icons
- **Database**: SQLite with Drizzle ORM
- **Analytics**: PostHog integration
- **Error Tracking**: Sentry integration
- **Testing**: Vitest with Vue Test Utils

### Project Structure

- `app/components/` - Vue components (Btn, Hero, Nav, Footer, Contact, blog components)
- `app/pages/` - File-based routing (index.vue, about.vue, blog/)
- `content/blog/` - Markdown blog posts
- `app/layouts/` - Layout components (default.vue)
- `app/plugins/` - Client-side plugins (posthog.client.js)
- `server/api/` - API routes (likes system endpoints)
- `server/database/` - Drizzle schema and migrations
- `server/utils/` - Server utilities (database connection, IP hashing)
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
- **Like System**: IP-based anonymous likes (max 10 per user per post)
  - BlogLikes component for interactive like/unlike functionality
  - API routes: `GET/POST /api/likes/[slug]`
  - Privacy-friendly using hashed IP addresses for user identification

### Database Architecture

- **Database**: SQLite with Drizzle ORM
- **ORM**: Full TypeScript support with inferred types
- **File Location**: `./data/portfolio.db`
- **Migrations**: Versioned schema changes with `drizzle-kit`
- **Performance**: WAL mode enabled for better concurrency
- **Schema**: Located in `server/database/schema.ts`

#### Database Tables

- **`post_likes`**: Stores blog post likes with IP-based user identification
  - `post_slug`: Blog post identifier
  - `user_hash`: Hashed IP address for anonymous users
  - `like_count`: Number of likes (0-10 per user per post)
  - Unique constraint on `(post_slug, user_hash)`

### Local Development Setup

- **Database**: SQLite file-based database (no external services needed)
- **Environment Files**: 
  - `.env` - Production configuration
  - `.env.local` - Local development configuration (same as production for SQLite)
- **Database Management**: Drizzle Studio GUI available via `pnpm db:studio`
- **Quick Start**: Just run `pnpm dev` - database file is created automatically

### Code Quality

- ESLint configuration with Nuxt and Vitest plugins
- Stylelint for CSS/SCSS/Vue style validation
- Husky + lint-staged for pre-commit hooks
- Commitlint for conventional commit messages
- Prettier for code formatting

## Important Implementation Notes

### Blog Like System
- Based on Josh Comeau's approach for privacy-friendly user tracking
- Uses hashed IP addresses to identify anonymous users
- 10-like limit per user per post to prevent spam
- Optimistic updates for better user experience
- API endpoints handle both adding and removing likes

### Environment Management
- **All Environments**: Uses SQLite file database (no credentials needed)
- **Database File**: Automatically created in `./data/portfolio.db`
- **Backup**: Simple file copy of `./data/portfolio.db`
- **Deployment**: Include database file in deployment or let it be created on first run

### Database Operations
- Always run `pnpm db:generate` after schema changes
- Run `pnpm db:migrate` to apply migrations to database
- Use `pnpm db:studio` for visual database management
- Database is a single file - easy to backup, copy, or reset
