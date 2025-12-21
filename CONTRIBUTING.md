# Contributing to no-frills-ui

Thank you for your interest in contributing to `no-frills-ui`! This document provides guidelines and instructions to help you get started.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Prerequisites

- **Node.js**: >= 20.0.0
- **Yarn**: 4.x (Corepack enabled)

## Development Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/pushkar8723/no-frills-ui.git
    cd no-frills-ui
    ```

2. **Enable Corepack**:

    ```bash
    corepack enable
    ```

3. **Install dependencies**:
    ```bash
    yarn install
    ```

## Development Workflow

### Running Storybook

We use Storybook for component development and documentation.

```bash
yarn storybook
```

This will start the Storybook server at `http://localhost:6006`.

### Building the library

To build the library for production (ESM and CJS):

```bash
yarn build
```

### Checking Bundle Size

To check the impact of your changes on the bundle size:

```bash
yarn size
```

## Coding Guidelines

### Component Structure

- Each component should reside in its own directory under `src/components/`.
- Use functional components with `React.forwardRef` where possible.
- Use Emotion for styling, fetching values via `getThemeValue(THEME_NAME.VARIANT)`.
- Export components from `src/components/index.ts`.

### TypeScript

- Enable strict mode (default).
- Avoid `any` types; use precise interfaces or types.
- Document props using JSDoc for Storybook documentation generation.

### Accessibility (WCAG 2.1 AA)

- All interactive components must support keyboard navigation (Tab, Enter, Space, Arrows, Escape).
- Use semantic HTML elements where possible.
- Ensure proper ARIA attributes (`aria-expanded`, `aria-controls`, `role`, etc.).
- Maintain sufficient color contrast (minimum 4.5:1).

## Testing

We use Jest and React Testing Library. All new features and bug fixes must include tests.

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Accessibility Testing

- Use `jest-axe` in unit tests to catch basic accessibility violations.
- `@axe-core/react` is active during Storybook development to log issues in the browser console.

## Pull Request Process

1. Create a descriptive branch for your changes: `git checkout -b feature/my-new-component`.
2. Ensure all tests pass: `yarn test`.
3. Ensure linting and formatting are correct: `yarn lint` and `yarn format:check`.
4. Submit a Pull Request targeting the `main` branch.
5. Provide a clear description of the changes and any relevant issue numbers.
6. Once CI checks pass and reviews are completed, your PR will be merged.

---

By contributing, you agree that your contributions will be licensed under the project's MIT License.
