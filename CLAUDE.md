# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the VibeStudio Master Repository (formerly PearAI) - a meta-repository containing multiple integrated components that make up the VibeStudio AI development environment. VibeStudio aims to be an inventory that curates leading, cutting-edge AI tools in one unified interface, allowing users to effortlessly switch between tools without hunting for alternatives.

**IMPORTANT REBRANDING NOTE**: This repository is currently being rebranded from PearAI to VibeStudio with the domain vibestudio.online. When working on this codebase, be aware that:
- References to "pearai", "pear", "trypear" should be updated to "vibestudio" variants
- Domain references should point to vibestudio.online
- Brand assets and naming conventions need updating throughout

## Technology Stack Overview

- **Main Platform**: TypeScript/Electron.js (VSCode fork)
- **Landing Page**: Next.js/React with Supabase auth (TailwindCSS + Shadcn)
- **Backend**: Python FastAPI server with Supabase database
- **Documentation**: Docusaurus v3
- **Logging/Telemetry**: Axiom and PostHog

## Major Components

### 1. PearAI App (`/pearai-app/`) - Core Editor Platform
**Purpose**: VSCode fork serving as the main editor platform
**Technology**: TypeScript/Electron.js
**Package Name**: `pearai` (v1.96.4)
**Architecture**: Based on Microsoft VSCode with PearAI-specific customizations

#### Key Directory Structure:
- `/src/bootstrap-*.ts` - Entry point bootstrapping files
- `/src/vs/` - Core VSCode functionality
  - `/src/vs/base/` - Foundation utilities (browser, common, node)
  - `/src/vs/platform/` - Platform services (30+ service modules)
  - `/src/vs/editor/` - Editor core functionality
  - `/src/vs/workbench/` - UI workbench and views
- `/src/vscode-dts/` - TypeScript definitions for VSCode API
- `/extensions/` - Built-in extensions (100+ extensions)
- `/build/` - Build scripts and configuration
- `/test/` - Test suites and utilities

#### Critical Build Commands:
```bash
cd ./pearai-app
npm install
npm run compile              # TypeScript compilation
npm run watch               # Watch mode (client + extensions)
npm run watch-client        # Client-only watch mode
npm run watch-extensions    # Extensions-only watch mode
npm run test-node          # Node.js unit tests
npm run test-browser       # Browser-based tests
npm run test-extension     # Extension tests
npm run eslint             # Code linting
npm run stylelint          # Style linting
npm run hygiene            # Code hygiene checks
npm run monaco-compile-check # Monaco editor type checking
npm run vscode-dts-compile-check # API definition checking
```

#### Development Workflow:
1. Use VSCode Run and Debug: "🚀 Start All Dev Servers" task or run individual components
2. Launch: `./pearai-app/scripts/code.sh` (Unix/Mac) or `./pearai-app/scripts/code.ps1` (Windows)
3. Available VSCode tasks: "📱 PearAI App: Watch", "🧩 Submodule: ESBuild Watch", "🚀 Roo Code: Watch", etc.
4. Debug configurations available for each component with proper source mapping

### 2. PearAI Roo Code (`/PearAI-Roo-Code/`) - AI Coding Agent
**Purpose**: Continue fork providing AI coding agent functionality
**Package Name**: `pearai-roo-cline` (v3.10.2)
**Technology**: TypeScript VSCode extension with React webview

#### Comprehensive Architecture:

##### Core Components (`/src/core/`):
- `Cline.ts` - Main agent orchestration class
- `CodeActionProvider.ts` - VSCode code action integration
- `EditorUtils.ts` - Editor manipulation utilities
- `contextProxy.ts` - Context management and proxying
- `mode-validator.ts` - Mode validation logic

##### API Layer (`/src/api/`):
**Providers** (`/src/api/providers/`):
- `anthropic.ts` - Anthropic Claude integration
- `openai.ts` - OpenAI GPT integration
- `gemini.ts` - Google Gemini integration
- `mistral.ts` - Mistral AI integration
- `ollama.ts` - Local Ollama integration
- `bedrock.ts` - AWS Bedrock integration
- `vertex.ts` - Google Vertex AI integration
- `vscode-lm.ts` - VSCode Language Model API
- `pearai.ts` - PearAI custom provider
- And 10+ other providers

**Transform Layer** (`/src/api/transform/`):
- Message format transformations for different AI providers
- Streaming response handling
- Provider-specific format conversions

##### Services Layer (`/src/services/`):
- **Browser** (`/browser/`) - Web scraping and content fetching
- **Checkpoints** (`/checkpoints/`) - Code state management and versioning
- **MCP** (`/mcp/`) - Model Context Protocol integration
- **Search** (`/search/`) - File and content search services
- **Telemetry** (`/telemetry/`) - Usage analytics and monitoring
- **Tree-sitter** (`/tree-sitter/`) - Code parsing and analysis

##### Integration Layer (`/src/integrations/`):
- **Editor** (`/editor/`) - VSCode editor integration, diff views
- **Terminal** (`/terminal/`) - Terminal interaction and command execution
- **Workspace** (`/workspace/`) - Workspace tracking and management
- **Theme** (`/theme/`) - Theme detection and adaptation
- **Diagnostics** (`/diagnostics/`) - Error and warning integration

##### Core Features (`/src/core/`):
- **Assistant Message** - AI response parsing and handling
- **Config** - Configuration management with custom modes
- **Diff** - Advanced diff strategies and implementations
- **Ignore** - File filtering and .rooignore support
- **Mentions** - Context mention system (@file, @folder, etc.)
- **Prompts** - System prompt construction and management
- **Sliding Window** - Context window management
- **Webview** - React UI integration

#### Critical Build Commands:
```bash
cd ./PearAI-Roo-Code
npm run install:all         # Install all dependencies (extension, webview, e2e, benchmark)
npm run build              # Full build (equivalent to vsix)
npm run package           # Build with type checking and linting
npm run dev               # Start webview development server
npm run compile           # TypeScript compilation + esbuild
npm run watch             # Watch mode for all components
npm run test              # Run all test suites
npm run test:extension    # Extension-specific tests
npm run test:webview      # Webview React tests
npm run lint              # ESLint for all components
npm run check-types       # TypeScript checking for all components
npm run vsix              # Create VSIX package
```

#### Webview UI (`/webview-ui/`):
- **Technology**: React + TypeScript with Vite
- **Components**: Chat interface, settings, history, prompts
- **Build**: `npm run build` for production, `npm run dev` for development
- **Testing**: React Testing Library + Jest

### 3. VS Landing Page (`/vs-lp/`) - Marketing Website
**Purpose**: Next.js marketing and landing page
**Package Name**: `open-pro-next` (v0.1.0)
**Technology**: Next.js 14 + React 18 + TypeScript

#### Key Features:
- **Authentication**: Supabase integration with auth helpers
- **UI Components**: Radix UI + TailwindCSS + Shadcn/ui
- **Analytics**: Vercel Analytics + PostHog
- **Content**: MDX-based blog posts and documentation
- **Payments**: Stripe integration components
- **Form Handling**: React Hook Form + Zod validation

#### Directory Structure:
- `/app/` - Next.js app router pages
- `/components/` - Reusable UI components
- `/lib/` - Utility functions and data fetching
- `/hooks/` - Custom React hooks
- `/types/` - TypeScript type definitions
- `/utils/` - Helper utilities and constants
- `/posts/` - Blog post content

#### Build Commands:
```bash
cd ./vs-lp
yarn install
yarn dev                  # Development server (Next.js)
yarn build               # Production build
yarn start               # Production server
yarn lint                # Next.js ESLint
yarn format              # Prettier formatting
```

### 4. PearAI Documentation (`/pearai-documentation/`) - Documentation Site
**Purpose**: Docusaurus-based documentation and guides
**Package Name**: `pearai-docs` (v0.0.0)
**Technology**: Docusaurus v3.2.1

#### Build Commands:
```bash
cd ./pearai-documentation
npm install
npm run start            # Development server
npm run build           # Production build
npm run serve           # Serve built site
npm run deploy          # Deploy to hosting
```

### 5. PearAI Submodule (`/pearai-submodule/`) - Continue Fork
**Purpose**: Continue.dev fork integrated as git submodule
**Technology**: TypeScript + Rust + Python components
**Installation**: Shell scripts for cross-platform setup

#### Build Commands:
```bash
./pearai-submodule/install-and-build.sh  # Unix/Mac installation
./pearai-submodule/install-and-build.ps1 # Windows installation
```

### 6. PearAI Server Issues (`/pearai-server-issues-public/`)
**Purpose**: Public issue tracking for PearAI server
**Content**: Issue templates and public server-related bugs

## Development Prerequisites

### Required Tools:
- **Rust/Cargo**: For native components compilation
- **Node.js**: Version =20.18.0 (exact version required)
- **npm**: Version =10.8.2 (exact version required)  
- **Yarn 1**: Version >=1.10.1 and <2 (for vs-lp)
- **Python**: Version =3.11.X (for node-gyp)
- **Git**: For version control and submodules

### Platform-Specific Compilers:
- **Windows**: Visual Studio Build Tools with C++ workload, MFC components, Spectre-mitigated libs
- **macOS**: Xcode + Command Line Tools (`xcode-select --install`)
- **Linux**: Development tools package (build-essential, etc.)

## Complete Installation Workflow

### 1. Initial Repository Setup:
```bash
git clone [repository-url] vibestudio
cd vibestudio
git submodule update --init --recursive
```

### 2. Component Installation:
```bash
# PearAI App
cd ./pearai-app && npm install

# PearAI Roo Code  
cd ../PearAI-Roo-Code && npm run install:all

# PearAI Submodule
../pearai-submodule/install-and-build.sh  # Unix/Mac
../pearai-submodule/install-and-build.ps1 # Windows

# VS Landing Page
cd ../vs-lp && yarn install

# Documentation
cd ../pearai-documentation && npm install
```

### 3. Development Startup:
1. **VSCode**: Open repository in VSCode/PearAI
2. **Run Configuration**: Use "🚀 Start All Dev Servers" from Run and Debug panel
3. **Launch Editor**: `./pearai-app/scripts/code.sh` or `./pearai-app/scripts/code.ps1`
4. **Alternative Setup**: Run `./setup-app-dev.sh` for automated setup of all components

## Testing Strategy

### PearAI App Testing:
- **Unit Tests**: Mocha-based (`npm run test-node`)
- **Browser Tests**: Playwright (`npm run test-browser`) 
- **Extension Tests**: VSCode test framework (`npm run test-extension`)
- **Performance**: `npm run perf` for performance testing

### PearAI Roo Code Testing:
- **Unit Tests**: Jest with 500+ test files
- **Coverage**: Comprehensive test coverage across all modules
- **E2E Tests**: Playwright-based end-to-end testing
- **Benchmark Tests**: Performance benchmarking suite

### Test File Patterns:
- Unit tests: `**/*.test.ts`, `**/__tests__/**`
- Mock files: `**/__mocks__/**`
- Test utilities: `**/test-utils.ts`, `**/testUtils.ts`

## Code Style and Standards

### General Guidelines (from VSCode heritage):
- **Indentation**: Tabs (not spaces)
- **Naming**: PascalCase for types/enums, camelCase for functions/variables
- **Documentation**: JSDoc for public APIs and complex functions
- **Functions**: Arrow functions preferred over anonymous functions
- **Control Flow**: Always use curly braces for loops and conditionals
- **Strings**: Double quotes for user-facing strings, single quotes otherwise

### TypeScript Specific:
- **Strict Mode**: Full TypeScript strict mode enabled
- **API Design**: Follow VSCode extension API patterns
- **Validation**: Comprehensive input validation with proper error handling
- **Async Operations**: Proper cancellation token usage
- **Type Safety**: Extensive use of branded types and strict null checks

### Linting and Formatting:
- **ESLint**: TypeScript-specific rules with header plugin
- **Prettier**: Consistent code formatting (enforced via lint-staged)
- **Stylelint**: CSS/SCSS linting where applicable
- **Husky**: Pre-commit hooks for code quality

### Additional VSCode-Specific Guidelines:
- **API Design**: Follow VSCode extension API patterns with proper cancellation tokens
- **Data Validation**: Validate provider data and throw errors when invalid
- **Global vs Private Events**: Use global events for objects accessible globally, private events for local objects
- **Provider Pattern**: Use data-driven provider interfaces with resolve methods for expensive operations
- **Object Design**: Classes for return objects, interfaces for parameter types

## Architecture Patterns

### VSCode Extension Architecture:
- **Activation**: Event-driven extension activation
- **Commands**: Declarative command registration and execution
- **Views**: WebView-based React components for complex UI
- **Services**: Dependency injection pattern for service management
- **Configuration**: Structured configuration with JSON schemas

### AI Provider Architecture:
- **Base Provider**: Abstract base class for all AI integrations
- **Transform Layer**: Message format standardization
- **Streaming**: Consistent streaming response handling
- **Error Handling**: Unified error handling and retry logic
- **Context Management**: Sliding window context optimization

### State Management:
- **Global State**: VSCode extension global state for persistence
- **Webview State**: React state management within webview components
- **Context Proxy**: Intelligent context sharing between components
- **Checkpoints**: Git-based state snapshots for development sessions

## Security Considerations

### File Access:
- **RooIgnore**: Comprehensive file filtering system
- **Path Validation**: Strict path sanitization and validation
- **Workspace Boundaries**: Respect workspace trust boundaries
- **Permission Checks**: Proper file system permission handling

### API Security:
- **Key Management**: Secure API key storage and transmission
- **Request Validation**: Input sanitization for all API requests
- **Rate Limiting**: Respect provider rate limits and quotas
- **Error Sanitization**: Prevent sensitive data leakage in errors

## Performance Optimization

### Context Management:
- **Sliding Window**: Intelligent context window management
- **Token Counting**: Accurate token usage tracking
- **Chunking**: Efficient file chunking for large codebases
- **Caching**: Strategic caching of expensive operations

### Resource Management:
- **Memory**: Careful memory management for large files
- **CPU**: Efficient parsing and analysis algorithms  
- **I/O**: Optimized file system operations
- **Network**: Connection pooling and request batching

## Debugging and Monitoring

### Development Tools:
- **VSCode Debugging**: Full debugging support with breakpoints
- **Console Logging**: Structured logging throughout codebase
- **Error Tracking**: Comprehensive error capture and reporting
- **Performance Profiling**: Built-in performance monitoring

### Production Monitoring:
- **Telemetry**: PostHog integration for usage analytics
- **Error Reporting**: Axiom integration for error tracking
- **Performance Metrics**: API response time and success rate monitoring
- **User Feedback**: Integrated feedback collection system

## Deployment and Distribution

### Extension Distribution:
- **VSIX Packaging**: Standard VSCode extension packaging
- **Marketplace**: VSCode Marketplace publication ready
- **Auto-updates**: Built-in extension update mechanisms
- **Version Management**: Semantic versioning with changelog generation

### Web Application Deployment:
- **Next.js**: Static site generation and server-side rendering
- **Vercel**: Optimized for Vercel deployment platform
- **CDN**: Asset optimization and global distribution
- **Environment Configuration**: Multi-environment support

## Migration Notes for Rebranding

### Files Requiring Updates:
1. **Package.json files**: Update names, descriptions, repositories, homepages
2. **Brand Assets**: Icons, logos, splash screens in `/assets/` directories
3. **Documentation**: All README files, documentation sites, help content
4. **Configuration**: Extension manifests, app manifests, build configurations
5. **API Endpoints**: Update server URLs and API base paths
6. **Domain References**: Update all trypear.ai references to vibestudio.online
7. **Social/Analytics**: Update tracking codes, social media references
8. **Legal**: Update license files, terms of service, privacy policies

### Search Patterns for Rebranding:
- `pearai`, `PearAI`, `PEARAI`
- `pear-`, `pear_`, `pear.`  
- `trypear.ai`, `trypear.com`
- `@pearai/`, `pearai-`
- File names containing "pear"
- Image assets and icons
- Configuration keys and identifiers

### Critical Considerations:
- **Git History**: Preserve commit history during renames
- **External Dependencies**: Update third-party service configurations
- **User Data**: Ensure smooth migration of user settings and data
- **Extension ID**: Handle VSCode extension ID migration carefully
- **API Compatibility**: Maintain backward compatibility during transition