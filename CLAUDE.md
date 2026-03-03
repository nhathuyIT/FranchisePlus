# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Summary
- Project: FranchisePlus — React + TypeScript + Vite frontend application
- Primary workflows: local dev (vite), type-check + build (tsc -b && vite build), lint (eslint)
- Key tools: Node (npm/yarn/pnpm), Vite, TypeScript (project refs), ESLint (flat config), Tailwind, Radix UI, Zustand, TanStack Query

Common commands
- Install dependencies
  - npm install
  - (or yarn / pnpm as preferred by the team)

- Local development (hot reloading)
  - npm run dev- Nguyễn Đức Vương
  - (runs: vite)

- Type-check + production build
  - npm run build
  - (runs: tsc -b && vite build)
  - Note: TypeScript project is configured with tsconfig.app.json and tsconfig.node.json. tsconfig.app.json sets "noEmit": true so tsc is used primarily for type checking and incremental build metadata.

- Lint
  - npm run lint
  - (runs: eslint . — repository uses eslint.config.js flat config)

- Preview production build locally
  - npm run preview
  - (runs: vite preview)

- Run a single test (repository has no test runner configured)
  - Tests are not present in package.json. If you add a test runner, here are common patterns:
    - Vitest: add "test": "vitest" to package.json then run a single test with:
      - npm run test -- -t "pattern"   (matches test name or regex)
    - Jest: add "test": "jest" then run a single test with:
      - npm run test -- -t "pattern"
  - Before running tests, check package.json for an existing "test" script: package.json:6-11

High-level architecture
- Purpose: Single-page application (SPA) built with React + TypeScript and Vite. UI primitives are in src/components/ui and pages in src/pages.

- Top-level entry points & structure
  - src/
    - pages/ — feature-based pages grouped by client/admin
      - Example: src/pages/client/homepage/index.tsx (client homepage)
      - Example: src/pages/admin/auth/login/admin-zod/admin-login-zod.ts (admin login validation logic)
    - components/ui/ — shared UI primitives (button, input, dialog, table, etc.)
      - Example: src/components/ui/button.tsx
    - components/common/ — higher-level components used across pages (e.g., StockStatusBadge)
      - Example: src/components/common/StockStatusBadge.tsx
    - layouts/ — layout components used by pages (client-layout, loading-layout)
      - Example: src/layouts/client-layout/client.layout.tsx
    - stores/ — global stores (zustand)
      - Example: src/stores/loading.store.ts
    - const/ — application constants (features, localstorage keys, coffee.const.ts)
    - lib/ — shared utilities (src/lib/utils.ts)

- Routing & state
  - Routing: react-router-dom is used (check src/pages and layout usage for routes).
  - Data fetching & caching: @tanstack/react-query is used.
  - Global state: zustand store(s) in src/stores.

- UI stack
  - Tailwind CSS (tailwindcss + @tailwindcss/vite integration)
  - Radix UI primitives for accessibility (avatar, select, dialog, tabs, etc.)
  - sonner for toasts
  - framer-motion + swiper for animations/sliders

Important configuration files (quick references)
- package.json: scripts and deps — package.json:1-11 and dependencies/devDependencies:12-68
- tsconfig.app.json: main TS options for the app (paths alias @/* -> src/*) — tsconfig.app.json:1-34
- tsconfig.json: project references to tsconfig.app.json and tsconfig.node.json — tsconfig.json:1-17
- eslint.config.js: flat ESLint config used in lint script — eslint.config.js:8-23

Where to start for common tasks
- Add a new page
  1. Create page under src/pages/<area>/... and export it from the area index if present.
  2. Wire route in the router definition (search codebase for current router implementation using Grep/Glob).
  3. Re-run dev server: npm run dev

- Add or change a UI primitive
  1. Edit component in src/components/ui/*.tsx. Keep props stable to avoid breaking consumers.
  2. Update usage in pages/components that import it.
  3. Run lint and type-check: npm run lint && npm run build

- Fix type errors
  - Run npm run build (this runs tsc -b). Since tsconfig.app.json uses "noEmit": true, the purpose is type checking.

Tooling & Claude Code usage notes (for future Claude Code agents)
- Preferred repository tools (always use these instead of shell commands when available):
  - Read to open file contents
  - Edit to perform targeted string replacements in existing files (must call Read first)
  - Write to create new files or overwrite entire files (if you Read existing file first when overwriting)
  - Glob to find files by pattern
  - Grep to search file contents (use ripgrep-like patterns)
  - Bash only for git operations and other small tasks that cannot be done with the dedicated tools

- Editing rules for Claude Code (must follow):
  - Always call Read on a file before calling Edit or Write for that file.
  - Use Edit for precise replacements and preserve exact indentation. If the Edit API fails due to non-unique old_string, include more context or use replace_all judiciously.
  - Prefer modifying existing files over creating new files unless a new file is required.
  - When a task touches multiple files or requires an implementation plan, enter plan mode (EnterPlanMode) and get user approval before making changes.

Git & CI notes
- Current working branch during the session: dev (see git status snapshot). Main branch is main.
- Do not force push main or amend public commits without explicit user approval.
- Only create commits when the user explicitly requests it. Follow the repository's commit style in recent commits (use normal present-tense concise messages). If creating commits, stage specific files rather than adding everything.

Missing or optional items
- Tests: There is no test runner configured in package.json. If you add Vitest or Jest, add a "test" script and update CLAUDE.md accordingly.
- CI: There is no CI config discovered by quick search; follow team's CI conventions if/when they appear.

Quick file pointers (examples to open first when exploring a task)
- package.json:6-11 (scripts)
- src/pages/client/homepage/index.tsx — client home implementation
- src/components/ui/button.tsx — UI primitive example
- src/layouts/client-layout/client.layout.tsx — layout for client pages
- src/lib/utils.ts — shared utilities
- src/stores/index.ts and src/stores/loading.store.ts — global stores

When in doubt
- If you need to search the codebase, use Glob for file globs and Grep for content. Use the Explore agent (via Agent tool) if the search is open-ended and requires deeper corpus analysis.
- Ask the user for clarification before making architecture-level changes or destructive git actions.

Last updated: 2026-03-02
