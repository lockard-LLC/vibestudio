# Repository Guidelines

## Project Structure & Module Organization
- `vibestudio-app/`: VS Code fork (Electron/TS). Scripts in `scripts/` start the editor.
- `VibeStudio-Roo-Code/`: VS Code extension; `webview-ui/` (React/Vite) and `e2e/` tests.
- `vibestudio-landing-page/`: Next.js marketing/app UI site.
- `vibestudio-documentation/`: Docusaurus docs site.
- `vibestudio-submodule/`: Continue-based submodule; `packages/` (TS) and `sync/` (Rust).
- `vibestudio-server-issues-public/`: Public issue tracker (docs only).

## Build, Test, and Development Commands
- Init submodules: `git submodule update --init --recursive`.
- Editor (app): `cd vibestudio-app && npm install`; dev compile: `npm run watch`; launch: `./scripts/code.ps1` (Windows) or `./scripts/code.sh`.
- Extension: `cd VibeStudio-Roo-Code && npm run install:all`; webview HMR: `cd webview-ui && npm run dev`; build: `npm run build`; E2E: `cd e2e && npm test`.
- Landing page: `cd vibestudio-landing-page && yarn install`; dev: `yarn dev`; lint/format: `yarn lint`, `yarn format`.
- Documentation: `cd vibestudio-documentation && npm install`; dev: `npm run start`.
- Rust (CLI/sync): `cargo build` / `cargo test` in `vibestudio-app/cli` or `vibestudio-submodule/sync`.

## Coding Style & Naming Conventions
- TypeScript/JS: Prettier + ESLint. Run `yarn format`/`npm run lint` where available.
- React: components PascalCase; hooks/utilities camelCase; Next.js routes follow defaults (e.g., `app/.../page.tsx`).
- Rust: `cargo fmt` with repo `rustfmt.toml`; modules snake_case.
- Imports: prefer relative within a package; avoid deep cross-package imports.

## Testing Guidelines
- Webview/UI: Jest + Testing Library in `webview-ui` (`*.test.tsx`).
- Extension E2E: Mocha in `VibeStudio-Roo-Code/e2e` via `npm test`.
- Editor: Mocha/Playwright commands in `vibestudio-app` (`npm run test-*`).
- Rust: `cargo test`. Add focused unit tests for new logic.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (e.g., `feat:`, `fix:`, `docs:`). Scope changes to one package when possible.
- PRs: clear summary, linked issues, and screenshots for UI changes. Note any config/env requirements.
- Quality gate: run lint/format/tests for touched packages before opening a PR.
- Upstream: minimize divergence from upstream in `vibestudio-app` and `VibeStudio-Roo-Code`.

## Security & Configuration Tips
- Never commit secrets. Use `.env.local` for local overrides.
- Reference examples: `vibestudio-landing-page/.env.local.example`, `VibeStudio-Roo-Code/e2e/.env.local.sample`.
- Verify telemetry/analytics keys before pushing.

