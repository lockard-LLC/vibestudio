# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository overview
- This is the VibeStudio master monorepo. Active development spans:
  - vibestudio-app/: VS Code fork serving as the main editor platform
  - VibeStudio-Roo-Code/: AI coding agent VS Code extension with a React webview UI
  - Additional repos mentioned in README (landing page, docs, submodules) may be present as submodules or sibling projects; follow per-component instructions below.

Prerequisites (from README)
- Node.js x64 20.18.0 and npm 10.8.2
- Rust/Cargo, Git, Python 3.11.x, and platform build toolchain (Windows: VS Build Tools C++ workload incl. Spectre libs)
- Yarn 1.x for the landing page when used

Common development commands
- Initial clone and submodules
  - git clone https://github.com/lockard-LLC/vibestudio.git
  - git submodule update --init --recursive

vibestudio-app (VS Code fork)
- Install
  - npm install (run inside vibestudio-app)
- Launch for development
  - scripts/code.ps1 (Windows) or scripts/code.sh (Unix/Mac)
- Run and Debug (recommended): use the “🚀 Start All Dev Servers” task from the editor’s Run and Debug panel
- Notes
  - The bulk of Pear/VS Code build/test tasks live inside vibestudio-app; use the provided VS Code tasks and launch configs in .vscode/ for watch/compile/test flows

VibeStudio-Roo-Code (AI agent extension)
- Install all dependencies (extension + webview + e2e + benchmark)
  - npm run install:all
- Build/package
  - npm run compile      # TypeScript compile + esbuild
  - npm run package      # Type check + lint + build webview + esbuild
  - npm run build        # Create VSIX (alias for vsix)
  - npm run vsix         # Package to bin/*.vsix
- Dev/watch
  - npm run dev          # Start webview (Vite) with HMR
  - npm run watch        # Watch esbuild + tsc
- Lint and type check
  - npm run lint         # Runs lint:* across extension/webview/e2e/benchmark
  - npm run check-types  # Runs check-types:* across components
- Tests
  - npm run test         # Runs test:* across components
  - npm run test:extension  # Jest tests for the extension
  - npm run test:webview    # Jest tests for the React webview
- Running a single test (examples)
  - Extension (Jest): npm run test:extension -- -t "Test name substring"
  - Webview (Jest): (cd webview-ui) npm test -- -t "Test name substring"
- Cleaning
  - npm run clean        # Cleans extension/webview/e2e/benchmark outputs

VibeStudio-Roo-Code sub-packages
- webview-ui/
  - Dev server: npm run dev
  - Build: npm run build
  - Lint: npm run lint
  - Type check: npm run check-types
  - Tests: npm run test
- e2e/
  - Build: npm run build  # builds extension + webview first, then e2e
  - Run tests: npm run test

Monorepo development flow (quick start)
- Install per README
  - vibestudio-app: npm install
  - VibeStudio-Roo-Code: npm run install:all
- Start dev services from the editor Run and Debug panel: “🚀 Start All Dev Servers”
- Launch the editor instance
  - Windows: .\vibestudio-app\scripts\code.ps1
  - Unix/Mac: ./vibestudio-app/scripts/code.sh
- Optional: Landing page dev (if present): cd vibestudio-landing-page && yarn dev

High-level architecture and relationships
- vibestudio-app (VS Code fork)
  - Provides the Electron/VS Code workbench, windowing, editor surfaces, terminal, and built-in extensions
  - Development is driven by VS Code tasks/launch configs; changes here typically require reloading the extension host/editor
- VibeStudio-Roo-Code (VS Code extension)
  - Core orchestration (src/core)
    - Cline.ts: agent orchestration
    - Context, diff, prompts, ignore, and sliding window subsystems
  - API providers (src/api/providers)
    - Multiple model integrations (Anthropic, OpenAI, Gemini, Mistral, Ollama, Bedrock, Vertex, VS Code LM, etc.)
  - Transform layer (src/api/transform)
    - Normalizes/streams provider-specific message formats
  - Services (src/services)
    - Browser content fetcher, search/glob, MCP integration, checkpoints, telemetry, and tree-sitter parsing
  - Integrations (src/integrations)
    - Editor utilities, diff view provider, terminal integration, workspace tracking, theming, diagnostics
  - Webview UI (webview-ui/)
    - React + Vite app for the sidebar experience: chat, history, prompts, settings; i18n and component library
  - Tests are extensive across extension, webview, e2e, and benchmark packages
- Typical runtime data flow
  - VS Code host (vibestudio-app) loads the extension -> extension registers commands/views -> user actions route to core agent (Cline) -> provider adapters handle model calls -> transform layer streams responses -> services augment context/search/checkpoints -> webview renders UI and interacts via VS Code message passing

Guidance from assistant rule files
- CLAUDE.md (important parts)
  - Rebranding: Update “pear/pearai/trypear” references to “vibestudio”; domain should be vibestudio.online
  - Tech stack and component boundaries as described above
  - Pay attention to package.json names, brand assets, docs, configs, endpoints, and analytics during rebranding work
- VibeStudio-Roo-Code/.clinerules
  - Ensure code changes have test coverage and all tests pass before submission
  - Do not disable lint rules without explicit approval
  - Webview UI styling: prefer Tailwind CSS utility classes over inline styles; introduce VS Code CSS vars in webview-ui/src/index.css before use
  - Adding a new persisted setting: follow cline_docs/settings.md
- vibestudio-app/.github/copilot-instructions.md (selected, VS Code guidelines)
  - Tabs for indentation; PascalCase for types/enums; camelCase for functions/properties/locals
  - Double quotes for user-visible localized strings, single quotes otherwise; externalize user-visible strings
  - Use arrow functions; always brace loop/conditional bodies; keep APIs conservative and data-driven; validate inputs; prefer global events for globally accessible objects

Notes and caveats
- Hot Module Reloading is enabled for React frontends (webview UI). Changes to the extension core typically require reloading the extension host.
- On Windows, use PowerShell-friendly paths and scripts (scripts/code.ps1). Ensure the Visual Studio C++ toolchain components listed in README are installed to satisfy native build steps.
- If you add or modify AI provider integrations, update both the provider adapter (src/api/providers) and any required transform logic; add tests accordingly.

If WARP.md already exists
- This is the initial version. If a prior WARP.md appears later, reconcile by:
  - Ensuring command examples map directly to package scripts
  - Keeping architecture at the “big picture” level (do not enumerate obvious files)
  - Folding in any new assistant rules or rebranding requirements

