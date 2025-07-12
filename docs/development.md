# Development Guide

## 🚀 Current Project Status

### ✅ Completed Setup (January 2025)
- **Project Foundation**: React 19 + TypeScript + Vite configured
- **Firebase Integration**: Full production setup with vibestudio-online project  
- **Development Tools**: ESLint + Prettier + Husky workflow
- **State Management**: Zustand store with persistence
- **TypeScript**: Path aliases and strict configuration
- **Dependencies**: All essential packages installed
- **Security**: Environment variables and .gitignore properly configured

## 📁 Project Structure

```
vibestudio/
├── src/
│   ├── firebase/         # All Firebase services (✅ Complete)
│   ├── components/       # React components (📁 Ready)
│   ├── hooks/           # Custom React hooks (📁 Ready)
│   ├── stores/          # Zustand stores (✅ App state configured)
│   ├── types/           # TypeScript definitions (✅ Base types defined)
│   ├── utils/           # Helper functions (✅ Utilities ready)
│   └── styles/          # Additional CSS (📁 Ready)
├── docs/                # Documentation for docs.vibestudio.online
├── .env.local           # Firebase config (✅ Configured)
├── CLAUDE.md           # Development conventions (✅ Complete)
└── package.json        # Dependencies (✅ All packages installed)
```

## 🔧 Tech Stack

### Core Framework
- **React 19** - Latest React framework
- **TypeScript 5.8.3** - Strict type checking
- **Vite 7.0.4** - Fast build tool

### UI & Styling
- **Tailwind CSS 4.1.11** - Utility-first CSS
- **Framer Motion 12.23.3** - Smooth animations
- **Lucide React 0.525.0** - Beautiful icons
- **React Hot Toast 2.5.2** - Toast notifications

### State & Data
- **Zustand 5.0.6** - Simple state management
- **TanStack Query 5.83.0** - Server state
- **React Router DOM 7.6.3** - Client-side routing

### Firebase Backend
- **Firebase 11.10.0** - Complete backend solution
- **Project ID**: vibestudio-online
- **Services**: Auth, Firestore, Storage, Functions, Realtime, Analytics

### Editor
- **Monaco Editor 0.52.2** - VS Code editor core
- **@monaco-editor/react 4.7.0** - React wrapper

### Development Tools
- **ESLint 9.30.1** - Code linting
- **Prettier 3.6.2** - Code formatting
- **Husky 9.1.7** - Git hooks

## 🛠️ Development Workflow

### Commands
```bash
# Install dependencies
yarn install

# Start development server (port 3000, auto-opens)
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Code quality
yarn lint         # Run ESLint
yarn type-check   # TypeScript validation
```

### TypeScript Path Aliases
Clean imports using path aliases:

```typescript
// Instead of: import { Component } from '../../../components/Component'
import { Component } from '@/components/Component'
import { useAppStore } from '@/stores'
import { User } from '@/types'
import { cn, formatDate } from '@/utils'
import { auth } from '@/firebase'
```

Available aliases:
- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/hooks/*` → `src/hooks/*`
- `@/stores/*` → `src/stores/*`
- `@/types/*` → `src/types/*`
- `@/utils/*` → `src/utils/*`
- `@/firebase/*` → `src/firebase/*`
- `@/styles/*` → `src/styles/*`

### Code Style & Conventions

**Formatting (Prettier)**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

**Naming Conventions**
- Variables/functions: `camelCase`
- Components: `PascalCase`
- Files: `kebab-case` or `PascalCase` for components
- Constants: `UPPER_SNAKE_CASE`

**TypeScript**
- Strict mode enabled
- Explicit types preferred
- No `any` types (use proper interfaces)
- Path aliases for clean imports

## 🔥 Firebase Configuration

### Environment Variables Example
```bash
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

### Firebase Services Available
- **Authentication** (`src/firebase/auth.ts`) - Google, GitHub, email/password
- **Firestore** (`src/firebase/firestore.ts`) - Real-time database with CRUD operations
- **Storage** (`src/firebase/storage.ts`) - File upload/download with progress tracking
- **Functions** (`src/firebase/functions.ts`) - Callable functions for AI processing
- **Realtime Database** (`src/firebase/realtime.ts`) - Live collaboration features
- **Security Rules** (`src/firebase/security-rules.ts`) - Production-ready security

## 🗂️ State Management

### Zustand Store Structure
```typescript
// src/stores/index.ts
interface AppState {
  user: User | null
  currentProject: Project | null
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  
  setUser: (user: User | null) => void
  setCurrentProject: (project: Project | null) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSidebar: () => void
}
```

**Persistence**: Theme and UI preferences persist across sessions.

## 📝 Type Definitions

### Core Types Available
```typescript
// src/types/index.ts
interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Date
  updatedAt: Date
}

interface Project {
  id: string
  name: string
  description?: string
  userId: string
  files: ProjectFile[]
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
}

interface ProjectFile {
  id: string
  name: string
  path: string
  content: string
  language: string
  size: number
  createdAt: Date
  updatedAt: Date
}
```

## 🛠️ Utility Functions

### Available Utilities
```typescript
// src/utils/index.ts
import { cn, formatDate, generateId, getFileLanguage, formatFileSize } from '@/utils'

// Conditional classes
cn('base-class', condition && 'conditional-class')

// Date formatting
formatDate(new Date()) // "Jan 12, 2025, 2:30 PM"

// File language detection
getFileLanguage('app.tsx') // "typescript"

// File size formatting
formatFileSize(1024) // "1 KB"
```

## 🎯 Next Development Phase

Ready to implement core VibeStudio features:

### 1. Authentication System
- Google/GitHub login with Firebase Auth
- User profile management
- Session persistence

### 2. Project Management
- Create/load/save projects in Firestore
- File system with real-time sync
- Project sharing and permissions

### 3. Code Editor Integration
- Monaco Editor setup with syntax highlighting
- Multiple file tabs
- AI-powered code completion

### 4. AI Chat Interface  
- Conversational AI assistant
- Context-aware code suggestions
- Project analysis and recommendations

### 5. Real-time Collaboration
- Live editing with Firebase Realtime Database
- User presence indicators
- Conflict resolution

## 📊 Development Status

**Foundation**: ✅ Complete - Ready for Feature Development
**Next Step**: Implement authentication system and basic project structure

---

*Last updated: January 2025*