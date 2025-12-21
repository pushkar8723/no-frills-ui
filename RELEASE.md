# Release Process

This document explains how to create and publish a new release of `no-frills-ui`.

## Quick Release Guide

All you need to do is:

1. **Update the version** in `package.json`:

    > [!IMPORTANT]
    > You must be on `main` branch to release a stable version.
    > Otherwise the `tag` may not map to the correct commit as we sqash merge our PRs.

    ```bash
    # For a patch release (bug fixes)
    npm version patch

    # For a minor release (new features, backward compatible)
    npm version minor

    # For a major release (breaking changes)
    npm version major

    # For a pre-release (alpha, beta, rc)
    npm version prerelease --preid=alpha
    ```

    This automatically:
    - Updates `package.json`
    - Creates a git commit
    - Creates a git tag

2. **Push the changes and tag**:

    ```bash
    git push && git push --tags
    ```

    Or in a single command:

    ```bash
    git push --follow-tags
    ```

That's it! 🎉 The rest is automated by GitHub Actions.

---

## What Happens Automatically

When you push a tag (e.g., `v0.0.14`), GitHub Actions automatically:

1. ✅ **Verifies** the version in `package.json` matches the tag
2. 🏗️ **Builds** the package (TypeScript compilation + Rollup bundling)
3. 📦 **Publishes** to npm (with appropriate tags for pre-releases)
4. 🎉 **Creates** a GitHub Release
5. 📚 **Deploys** Storybook documentation (for stable releases)

---

## Detailed Workflow

### 1. Version Management

The project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes that require users to update their code
- **MINOR** (0.1.0): New features that are backward compatible
- **PATCH** (0.0.1): Bug fixes and minor improvements
- **PRE-RELEASE** (0.0.1-alpha.0): Pre-release versions for testing

When you run `npm version <type>`, it:

- Updates the version number in `package.json`
- Creates a git commit with the message "v0.0.X"
- Creates a git tag with the version number (e.g., `v0.0.14`)

### 2. GitHub Actions: Publish to npm

**Trigger:** Push a tag matching `v*.*.*` (or pre-release patterns like `v*.*.*-alpha.*`)

**Workflow file:** `.github/workflows/publish-npm.yml`

**Steps:**

1. **Get version from tag**
    - Extracts the version number from the git tag
    - Detects if it's a pre-release (alpha, beta, rc)
    - Sets appropriate npm publish flags

2. **Detect package manager**
    - Checks for `yarn.lock` or `package-lock.json`
    - Uses the appropriate package manager for the project

3. **Verify version**
    - Ensures `package.json` version matches the git tag
    - Fails if there's a mismatch (prevents accidental publishes)

4. **Install dependencies**
    - Uses `npm ci` or `yarn install --frozen-lockfile`
    - Ensures reproducible builds

5. **Build package**
    - Runs `npm run build` which:
        - **Clean**: Removes old `dist/` and `lib-esm/` directories
        - **TypeScript compilation** (`tsc`):
            - Compiles TypeScript source files from `src/`
            - Generates ES modules in `lib-esm/`
            - Creates type definitions (`.d.ts` files)
        - **Rollup bundling** (`rollup -c`):
            - Bundles the library for CommonJS (`dist/index.js`)
            - Optimizes dependencies and tree-shaking
            - Excludes peer dependencies from the bundle

6. **Publish to npm**
    - Uses the `NPM_TOKEN` secret for authentication
    - For stable releases: publishes with `--access public` (becomes `latest` tag)
    - For pre-releases: publishes with `--tag alpha` flag
    - Users can install pre-releases with: `npm install no-frills-ui@alpha`

7. **Create GitHub Release**
    - Automatically creates a GitHub release from the tag
    - Marks it as a pre-release if applicable
    - Makes the release visible on the repository's releases page

8. **Summary**
    - Displays success message with links to npm and GitHub release
    - Shows installation instructions

### 3. GitHub Actions: Deploy Storybook Documentation

**Trigger:** When a GitHub Release is published (only for stable releases, not pre-releases)

**Workflow file:** `.github/workflows/deploy-storybook.yml`

**Steps:**

1. **Check if pre-release**
    - Skips deployment if it's a pre-release (alpha, beta, rc)
    - Only deploys documentation for stable releases

2. **Build Storybook**
    - Runs `npm run build-storybook`
    - Generates static documentation site in `storybook-static/`

3. **Checkout gh-pages branch**
    - Switches to the `gh-pages` branch
    - Creates it if it doesn't exist

4. **Copy build to version directory**
    - Creates a directory named after the version (e.g., `v0.0.14/`)
    - Copies the Storybook build into that directory
    - This allows multiple versions to coexist

5. **Update index.html**
    - Creates/updates a landing page at the root
    - Lists all available documentation versions
    - Uses the GitHub API to dynamically fetch versions
    - Automatically highlights the latest version
    - Provides a beautiful UI to navigate between versions

6. **Push to gh-pages**
    - Commits and pushes changes to the `gh-pages` branch
    - GitHub Pages automatically deploys the updated site
    - Documentation is available at: `https://pushkar8723.github.io/no-frills-ui/`

### 4. Package Contents

Only specific files are included in the npm package (defined in `package.json`):

```json
"files": [
  "dist",
  "lib-esm"
]
```

- **`dist/`**: CommonJS bundle for Node.js and older bundlers
- **`lib-esm/`**: ES modules for modern bundlers with tree-shaking support

### 5. Entry Points

The package provides multiple entry points for different module systems:

```json
"main": "dist/index.js",        // CommonJS (Node.js, older tools)
"module": "lib-esm/index.js",   // ES modules (modern bundlers)
"types": "lib-esm/index.d.ts"   // TypeScript definitions
```

This allows consumers to use the most appropriate format for their setup.

### 6. Testing the Package

Before publishing, you can test the package locally:

```bash
# Pack the package (creates a .tgz file)
npm pack

# Install it in a test project
cd /path/to/test-project
npm install /path/to/no-frills-ui/no-frills-ui-0.0.13.tgz
```

Or use `npm link`:

```bash
# In the no-frills-ui directory
npm link

# In your test project
npm link no-frills-ui
```

---

## Pre-Release Checklist

Before creating a release:

- [ ] All changes are committed and pushed to the main branch
- [ ] Tests pass (if applicable)
- [ ] Storybook documentation is up to date
- [ ] Version number is appropriate for the changes
- [ ] Peer dependencies are correct in `package.json`
- [ ] `package.json` version is updated (via `npm version` command)

## Post-Release Verification

After pushing the tag, the GitHub Actions will run automatically. You can monitor progress:

1. **Check GitHub Actions**:
    - Go to: https://github.com/pushkar8723/no-frills-ui/actions
    - Verify the "Publish to npm" workflow succeeds
    - For stable releases, verify "Deploy Versioned Storybook to GitHub Pages" succeeds

2. **Verify the package on npm**:
    - Visit: https://www.npmjs.com/package/no-frills-ui
    - Check the version and files are correct
    - For pre-releases, check the `alpha` tag

3. **Verify the GitHub Release**:
    - Visit: https://github.com/pushkar8723/no-frills-ui/releases
    - Check the release was created with the correct tag

4. **Verify Storybook documentation** (for stable releases):
    - Visit: https://pushkar8723.github.io/no-frills-ui/
    - Check the new version appears in the list
    - Click through to verify the documentation loads

5. **Test in a real project**:
    ```bash
    npm install no-frills-ui@latest
    # or for pre-releases
    npm install no-frills-ui@alpha
    ```

---

## Troubleshooting

### GitHub Action fails: "Version doesn't match tag"

- The `package.json` version must exactly match the git tag
- If tag is `v0.0.14`, package.json must be `0.0.14` (without the `v`)
- Solution: Delete the tag, fix package.json, and re-tag

### GitHub Action fails: "Unauthorized" when publishing to npm

- The `NPM_TOKEN` secret is missing or invalid
- Update the secret at: https://github.com/pushkar8723/no-frills-ui/settings/secrets/actions
- Generate a new token at: https://www.npmjs.com/settings/[your-username]/tokens
- Token needs "Automation" or "Publish" permission

### Storybook deployment doesn't work

- Check if the release is marked as a pre-release (pre-releases skip deployment)
- Verify GitHub Pages is enabled for the `gh-pages` branch
- Check the workflow logs for errors

### Local build fails

- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`
- Try cleaning first: `npm run clean && npm run build`

### Version already exists on npm

- You cannot republish the same version
- Bump to a new version: `npm version patch` and push the new tag
- For mistakes, use pre-release versions to test: `npm version prerelease --preid=alpha`

### Styles not working in consumer apps

- Ensure peer dependencies are correctly declared in `package.json`
- Consumers must install both:
    - `@emotion/react@^11.0.0`
    - `@emotion/styled@^11.0.0`
- See the CodeSandbox setup guide in the repository

---

## GitHub Actions Configuration

### Required Secrets

Configure these in repository settings → Secrets and variables → Actions:

- **`NPM_TOKEN`**: Authentication token for publishing to npm
    - Create at: https://www.npmjs.com/settings/[your-username]/tokens
    - Type: Automation token
    - Scope: Read and write to packages

### Required Permissions

The workflows need:

- **`contents: write`**: To create releases and push to gh-pages branch
- **`GITHUB_TOKEN`**: Automatically provided by GitHub Actions

---

## Release Types

### Stable Release

```bash
npm version patch  # or minor, major
git push --tags
```

- Published to npm with `latest` tag
- GitHub Release created
- Storybook documentation deployed

### Pre-release (Alpha)

```bash
npm version prerelease --preid=alpha
git push --tags
```

- Published to npm with `alpha` tag
- GitHub Release created (marked as pre-release)
- Storybook documentation NOT deployed

### Installation Commands

```bash
# Latest stable version
npm install no-frills-ui

# Specific version
npm install no-frills-ui@0.0.14

# Latest alpha version
npm install no-frills-ui@alpha

# Specific alpha version
npm install no-frills-ui@0.0.14-alpha.0
```
