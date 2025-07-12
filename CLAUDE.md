# Project Conventions for Claude

## Package Manager
- Use `yarn` (not npm)
- Always use `yarn@latest`

## Code Style
- Indentation: 2 spaces (no tabs)
- Naming conventions: camelCase for variables/functions, PascalCase for components
- File structure: Short directory names, minimal underscores
- TypeScript: Strict mode, explicit types preferred
- Formatting: Prettier with single quotes, no semicolons
- Linting: ESLint with TypeScript and React rules

## Project Info
- Project name: VibeStudio
- Framework: React 19 + TypeScript + Vite
- Styling: Tailwind CSS
- State: Zustand with persistence
- Backend: Firebase (auth, firestore, storage, functions, realtime)
- AI Integration: Monaco Editor for code editing
- Icons: Lucide React
- Animations: Framer Motion
- Notifications: React Hot Toast
- Routing: React Router DOM v7
- Server State: TanStack Query

## Commands
- Install dependencies: `yarn install`
- Build: `yarn build` (tsc -b && vite build)
- Dev: `yarn dev` (runs on port 3000, auto-opens browser)
- Lint: `yarn lint`
- Type check: `yarn type-check`
- Preview: `yarn preview`

## File Structure
```
src/
  firebase/     # All Firebase service configs (auth, firestore, storage, etc.)
  components/   # React components
    editor/     # Monaco Editor integration components
    ide/        # IDE layout components (ActivityBar, Sidebar, etc.)
    onboarding/ # User onboarding flow components
    cody/       # Cody AI assistant components
    auth/       # Authentication components
    layout/     # General layout components
    profile/    # User profile components
  hooks/        # Custom React hooks
  stores/       # Zustand stores (app state with persistence)
  types/        # TypeScript type definitions (User, Project, etc.)
  utils/        # Utility functions (cn, formatDate, etc.)
  styles/       # Additional CSS files
  config/       # App configuration (empty currently)
  pages/        # Page components
  contexts/     # React contexts
vendor/
  monaco-editor/ # Monaco Editor source (git subtree)
docs/           # Project documentation
```

## TypeScript Path Aliases
- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/hooks/*` → `src/hooks/*`
- `@/stores/*` → `src/stores/*`
- `@/types/*` → `src/types/*`
- `@/utils/*` → `src/utils/*`
- `@/firebase/*` → `src/firebase/*`
- `@/styles/*` → `src/styles/*`
- `@/vendor/*` → `vendor/*`

## Dependencies
### Core Framework
- `react@19.1.0` - React framework
- `react-dom@19.1.0` - React DOM
- `typescript@5.8.3` - TypeScript
- `vite@7.0.4` - Build tool

### UI & Styling
- `tailwindcss@4.1.11` - CSS framework
- `@tailwindcss/postcss@4.1.11` - PostCSS integration
- `framer-motion@12.23.3` - Animations
- `lucide-react@0.525.0` - Icons
- `react-hot-toast@2.5.2` - Notifications

### State & Data
- `zustand@5.0.6` - State management
- `@tanstack/react-query@5.83.0` - Server state
- `react-router-dom@7.6.3` - Routing

### Firebase
- `firebase@11.10.0` - Firebase SDK

### Editor
- `@monaco-editor/react@4.7.0` - Monaco Editor React wrapper
- `monaco-editor@0.52.2` - Monaco Editor core

### Development Tools
- `eslint@9.30.1` - Linting
- `prettier@3.6.2` - Code formatting
- `husky@9.1.7` - Git hooks
- `@types/node@24.0.13` - Node.js types

### Utilities
- `clsx@2.1.1` - Conditional classes

## Firebase Setup
- Production Firebase config in src/firebase/
- Environment variables for Firebase keys (.env.local)
- Services: auth, firestore, storage, functions, realtime, analytics, performance, remote-config
- Project ID: vibestudio-online
- All services configured with emulator support

## Development Workflow
1. **Linting**: ESLint + Prettier integration with pre-commit hooks
2. **Type Safety**: Strict TypeScript with path aliases
3. **State Management**: Zustand store with persistence for theme/UI state
4. **Hot Reload**: Vite dev server with fast refresh
5. **Git Hooks**: Husky for pre-commit linting

## Environment Variables
```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/

# Development Configuration
VITE_USE_FIREBASE_EMULATOR=false

# Database Configuration
VITE_FIRESTORE_DB_ID=your_firestore_db_id
VITE_FIREBASE_STORAGE_BUCKET_FULL=gs://your-project.firebasestorage.app
VITE_CLOUD_SQL_INSTANCE_ID=your_sql_instance
VITE_CLOUD_SQL_DATABASE_NAME=your_database_name
VITE_CLOUD_SQL_SERVICE_ID=your_service_id

# Production Migration Status
VITE_FIRESTORE_MODE=test
VITE_STORAGE_MODE=test

# AI Service Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Project Current Status
✅ Project structure and dependencies set up
✅ Firebase services configured (production-ready)
✅ TypeScript paths and aliases configured
✅ Zustand store with app state management
✅ ESLint + Prettier + Husky development workflow
✅ Environment variables and security setup
✅ Utility functions and type definitions
✅ Complete onboarding flow with Cody AI assistant
✅ Professional IDE layout (ActivityBar, Sidebar, Terminal, StatusBar)
✅ Monaco Editor integration with VS Code-like themes
✅ File explorer, search, git integration, extensions views
✅ Monaco Editor source added as git subtree (vendor/monaco-editor/)

## Other Conventions
- No comments unless absolutely necessary
- Production-ready code only
- Firebase security rules implementation required
- Real data connections (no dummy/sample code)
- Clean, modern UI with Tailwind
- AI-first architecture design
- Use path aliases for clean imports
- Persist user preferences in Zustand store