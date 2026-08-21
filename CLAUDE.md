# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

no-frills-ui is a React component library built on native HTML elements (not div soup) with Emotion styling and CSS variable theming. It ships as both CJS (`dist/`) and ESM (`lib-esm/`) bundles. Peer dependencies: react, react-dom, @emotion/react, @emotion/styled.

## Common Commands

```bash
yarn build              # Production build (tsc declarations + Rollup)
yarn build:dev          # Development build
yarn test               # Run all Jest tests
yarn test:watch         # Watch mode
yarn test:coverage      # Coverage report
yarn lint               # ESLint check
yarn lint:fix           # ESLint auto-fix
yarn format:check       # Prettier check
yarn storybook          # Dev server on port 6006
yarn size               # Check bundle size limits
```

To run a single test file: `yarn jest test/components/Button.test.tsx`

## Architecture

### Component Pattern

Components live in `src/components/<Name>/` with barrel exports. The standard pattern:

- Functional component with `React.forwardRef`
- Styled with Emotion (`@emotion/styled`)
- Colors referenced via `getThemeValue(THEME_NAME.X)` which resolves to `var(--nfui-*, fallback)`
- Props extend native HTML element attributes (e.g. `ButtonHTMLAttributes`)
- Exported from `src/components/index.ts` -> `src/index.ts`

### Theming System

`src/shared/constants.ts` defines the theme: `THEME_CONSTANTS` (default hex values), `THEME_NAME` (CSS variable names like `--nfui-primary`), and `getThemeValue()` which produces `var(--nfui-primary, #1f7ac5)`. Users override by setting CSS variables on a parent element.

### LayerManager (Portal System)

`src/shared/LayerManager.tsx` is a singleton that manages portals for overlays (modals, dialogs, toasts, notifications, popovers). Key points:

- `renderLayer(config)` returns `[Component, closeFn]` - call it once (not in render), store the component in state
- Manages z-index stacking automatically starting at 10000
- Handles ESC key, overlay click dismissal, entry/exit animations, body scroll lock, and `aria-hidden` on siblings
- `LAYER_POSITION` enum controls placement (TOP_LEFT, BOTTOM_RIGHT, DIALOG, etc.)

### Imperative vs Declarative Components

Most components are declarative (render via JSX). Three use an imperative pattern via class components: **Dialog**, **Notification**, **Toast**. These call `LayerManager.renderLayer()` in methods like `open()`, not in `render()`.

### Test Structure

Tests are in `test/components/` (one file per component). Setup in `test/test-setup.ts` configures jest-axe (`toHaveNoViolations`) and jest-dom matchers. The `@/` path alias maps to `src/`.

## Code Style

- Prettier: 4-space indent, single quotes, trailing commas, 100 char width
- ESLint enforces import ordering: builtins -> externals (react first) -> @emotion -> internal (shared) -> siblings
- TypeScript strict mode; `jsxImportSource: @emotion/react`
- Pre-commit hook runs lint-staged + full build

## Bundle Size Limits

Enforced via size-limit: full CJS bundle < 25 KB gzip, single component (Button) < 5 KB gzip.

## Release Process

Releases must be made from the `main` branch (PRs are squash-merged, so tags on other branches may point to wrong commits).

```bash
npm version patch    # or minor, major, prerelease --preid=alpha
git push --follow-tags
```

`npm version` updates package.json, creates a commit, and creates a git tag. Pushing the tag triggers automation:

1. **publish-npm.yml** - Triggered by tags matching `v*.*.*`. Verifies package.json version matches tag, builds, publishes to npm (`--access public`; pre-releases get `--tag alpha`), and creates a GitHub Release.
2. **deploy-storybook.yml** - Triggered when a GitHub Release is published. Skips pre-releases. Builds Storybook, copies to a versioned directory on `gh-pages`, and updates the index page.

Other CI workflows:

- **ci.yml** - Runs on push/PR to main: lint, format check, build, test with coverage (uploaded to Coveralls)
- **compatibility.yml** - Tests against both React 18 and 19
- **size-limit.yml** - Checks bundle size on PRs
