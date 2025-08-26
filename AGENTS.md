# Repository Guidelines

## Project Structure & Module Organization
- `vibestudio-app/`: VSCode fork (Electron/TS). Scripts in `scripts/` start the editor.
- `VibeStudio-Roo-Code/`: VSCode extension + `webview-ui/` (React/Vite) and `e2e/`.
- `vibestudio-landing-page/`: Next.js site (marketing/app UI).
- `vibestudio-documentation/`: Docusaurus docs site.
- `vibestudio-submodule/`: Continue-based submodule; includes `packages/` (TS) and `sync/` (Rust).
- `vibestudio-server-issues-public/`: Public server issue tracker (docs only).

## Build, Test, and Development Commands
- Init submodules: `git submodule update --init --recursive`
- Editor (vibestudio-app):
  - Install: `cd vibestudio-app && npm install`
  - Dev compile: `npm run watch` (client + extensions)
  - Launch editor: `./vibestudio-app/scripts/code.ps1` (Windows) or `./scripts/code.sh`
- Roo Code extension:
  - Install deps: `cd VibeStudio-Roo-Code && npm run install:all`
  - Webview dev (HMR): `cd VibeStudio-Roo-Code/webview-ui && npm run dev`
  - Build extension: `cd VibeStudio-Roo-Code && npm run build`
  - E2E: `cd VibeStudio-Roo-Code/e2e && npm test`
- Landing page:
  - Install: `cd vibestudio-landing-page && yarn install`
  - Dev: `yarn dev`  • Lint/format: `yarn lint`, `yarn format`
- Documentation:
  - Install: `cd vibestudio-documentation && npm install`
  - Dev: `npm run start`
- Rust (CLI/sync):
  - Build/test: `cargo build` / `cargo test` in `vibestudio-app/cli` or `vibestudio-submodule/sync`

## Coding Style & Naming Conventions
- TypeScript/JS: Prefer Prettier + ESLint. Run `yarn format`/`npm run lint` where available.
- React components: PascalCase files; hooks/utilities: camelCase. Next.js route files follow framework defaults (e.g., `app/.../page.tsx`).
- Rust: `cargo fmt` and `rustfmt.toml` respected; keep modules snake_case.
- Imports: use relative paths within package; avoid deep cross-package imports.

## Testing Guidelines
- Webview/UI: Jest + Testing Library in `webview-ui` (`*.test.tsx`).
- Extension E2E: Mocha via `VibeStudio-Roo-Code/e2e`.
- Editor (core): Mocha/Playwright targets exist in `vibestudio-app` (`npm run test-*`).
- Rust: `cargo test`. Add focused unit tests for new logic.

## Commit & Pull Request Guidelines
- Commits: follow Conventional Commits (e.g., `feat:`, `fix:`, `docs:`). Keep changes scoped to one package when possible.
- PRs: include a clear summary, linked issues, and screenshots for UI changes (webview/landing page). Note any config/env requirements.
- Quality gate: run lint/format/tests for touched packages before opening a PR.
- Upstream awareness: changes in `vibestudio-app` and `VibeStudio-Roo-Code` should minimize divergence from upstream forks.

## Security & Configuration Tips
- Secrets live in environment files (examples: `vibestudio-landing-page/.env.local.example`, `VibeStudio-Roo-Code/e2e/.env.local.sample`). Do not commit real secrets.
- Use `.env.local` for local overrides. Verify telemetry/analytics keys before pushing.

