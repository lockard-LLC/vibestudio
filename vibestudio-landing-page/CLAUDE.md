# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the VibeStudio Landing Page - a Next.js 14 application that serves as the marketing website and user portal for VibeStudio, an AI-powered mood-adaptive IDE. The application features authentication, pricing, dashboard functionality, and content management.

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI primitives + shadcn/ui components
- **Authentication**: Supabase Auth with SSR support
- **Database**: Supabase (PostgreSQL)
- **Analytics**: PostHog, Vercel Analytics, Speed Insights
- **Deployment**: Vercel
- **Package Manager**: Yarn (v1.22.22)
- **Fonts**: Geist Sans and Geist Mono

## Development Commands

### Essential Commands

```bash
# Install dependencies
yarn install

# Development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Code formatting and linting
yarn format    # Prettier formatting
yarn lint      # Next.js ESLint linting
```

### Environment Setup

Create `.env.local` with required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_TEST_MODE_ENABLED=false
GITHUB_TOKEN=your_github_token
```

## Architecture Overview

### App Router Structure

- **`app/(auth)/`** - Authentication pages with grouped routing
- **`app/(default)/`** - Main marketing pages
- **`app/api/`** - API routes for backend functionality
- **`app/dashboard/`** - User dashboard and account management
- **Root Layout** - Global providers, theme, analytics, and header

### Component Architecture

- **`components/ui/`** - Reusable UI primitives (shadcn/ui based)
- **`components/`** - Page-specific components and layouts
- **`hooks/`** - Custom React hooks for API calls and state
- **`lib/`** - Utility functions and data fetching logic
- **`utils/`** - Helper utilities including Supabase clients

### Key Features

1. **Authentication System**: Supabase-powered auth with server-side rendering
2. **Dynamic Content**: Blog posts, changelog, and release information
3. **Subscription Management**: Stripe integration for pricing and payments
4. **Download System**: Platform-specific download handling
5. **Analytics Integration**: PostHog, Vercel Analytics, and Speed Insights

## Important Development Patterns

### Authentication Flow

- Server-side authentication with Supabase SSR helpers
- Client-side auth state management in components
- Protected routes use middleware for access control
- Auth actions defined in `app/(auth)/actions.ts`

### API Routes Pattern

API routes in `app/api/` handle:

- Subscription management (`cancel-subscription`, `upgrade-subscription`)
- Checkout sessions (`create-checkout-session`, `create-topup-session`)
- Download tracking and feedback
- User signup and dashboard data

### Component Patterns

- Use `forwardRef` for components that need ref forwarding
- Server Components for data fetching, Client Components for interactivity
- Consistent use of `cn()` utility for className merging
- TypeScript interfaces for props and API responses

### Styling Conventions

- Custom color system with HSL CSS variables
- Responsive design with Tailwind breakpoints
- Dark mode support via `next-themes`
- Custom animations and transitions defined in Tailwind config

## Configuration Files

### Core Configuration

- **`next.config.js`** - Next.js configuration with SVG handling and redirects
- **`tailwind.config.js`** - Extended design system with custom colors and animations
- **`tsconfig.json`** - TypeScript configuration with path aliases
- **`.eslintrc.json`** - ESLint rules with Prettier integration

### Build and Deploy

- **`vercel.json`** - Vercel deployment configuration
- **`package.json`** - Uses Yarn for package management
- **`VERCEL_DEPLOYMENT.md`** - Comprehensive deployment guide

## Data Management

### Supabase Integration

- **Client-side**: `utils/supabase/client.ts` for browser operations
- **Server-side**: `utils/supabase/server.ts` for SSR and API routes
- **Middleware**: `utils/supabase/middleware.ts` for auth middleware

### Content Management

- **Blog Posts**: MDX files in `posts/` directory
- **Changelog**: React components with timeline functionality
- **Release Data**: GitHub API integration for version information

## Testing and Quality

### Code Quality Tools

- **ESLint**: Next.js core web vitals + Prettier rules
- **Prettier**: Code formatting with trailing commas and 80-character width
- **TypeScript**: Strict mode enabled with proper type safety
- **SVG-JSX Plugin**: Ensures proper SVG component usage

### Performance Monitoring

- **Vercel Analytics**: Built-in performance tracking
- **Speed Insights**: Core Web Vitals monitoring
- **PostHog**: User analytics and feature tracking

## Deployment

### Vercel Deployment

- **Framework**: Auto-detected as Next.js
- **Build Command**: `yarn build`
- **Install Command**: `yarn install`
- **Output Directory**: `.next`
- **Regions**: Primary deployment in `iad1`

### Environment Management

- Production environment variables managed through Vercel dashboard
- Domain rewrites configured for documentation (`/docs` → `docs.vibestudio.online`)
- API function timeout set to 30 seconds

## Common Development Tasks

### Adding New Pages

1. Create page component in appropriate `app/` directory
2. Add navigation links in `components/header.tsx` if needed
3. Update metadata using `constructMetadata` utility
4. Add TypeScript types if API integration required

### Working with UI Components

1. Use existing shadcn/ui components from `components/ui/`
2. Follow Radix UI patterns for accessibility
3. Extend components with forwardRef when needed
4. Use `cn()` utility for conditional styling

### API Integration

1. Create type definitions in `types/` directory
2. Use custom hooks in `hooks/` for data fetching
3. Implement error handling and loading states
4. Follow Supabase patterns for authentication

### Content Updates

1. Blog posts: Add MDX files to `posts/` directory
2. Changelog: Update `app/changelog/changelog.tsx`
3. Release data: Automatically fetched from GitHub API
4. Images: Store in `public/images/` with proper optimization

## Security Considerations

- API keys and secrets use environment variables
- Supabase RLS (Row Level Security) enforced
- HTTPS-only in production
- Proper input validation on API routes
- CSP headers and security best practices via Vercel
