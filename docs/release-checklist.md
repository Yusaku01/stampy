# Release Checklist

Use this before publishing the first public repository or npm package.

## Repository

- [x] Choose the public repository URL:
      `https://github.com/Yusaku01/stampy`.
- [x] Add the repository URL to `packages/core/package.json`.
- [x] Confirm `README.md`, `LICENSE`, `CONTRIBUTING.md`, and `SECURITY.md` are
      readable on GitHub. Confirmed through the GitHub API on 2026-06-27.
- [x] Add the GitHub repository description and topics.
- [x] Add GitHub issue templates, a pull request template, and Dependabot
      config for public maintenance.
- [x] Enable branch protection for `main`.
      Required status check: `Test, typecheck, build, and pack`.
- [x] Confirm the GitHub Actions CI workflow passes on the default branch.
      Latest confirmed run: `28291733640`, success on 2026-06-27 for
      `cc7cf59`.

## Package

- [ ] Confirm the npm package name and scope. `npm view @stampy/core` returned
      `E404` on 2026-06-27, which means the package was not publicly readable at
      that time; final availability still depends on npm account/scope access.
- [ ] Confirm the Studio npm package name and scope. `@stampy/studio` should be
      published as a CLI-backed local static Studio after `@stampy/core` is
      published.
- [ ] Confirm the Kit npm package name and scope. `@stampy/kit` should be
      published after both `@stampy/core` and `@stampy/studio`.
- [ ] Confirm npm authentication. `npm whoami` returned `E401 Unauthorized` on
      2026-06-27, so publishing requires npm login before the first release.
- [x] Update `packages/core/package.json` from `0.0.0` to the intended release
      version. First release version: `0.1.0`.
- [x] Prepare `packages/studio/package.json` for npm distribution with a
      `stampy-studio` bin, static `dist` files, package metadata, and
      `@stampy/core@0.1.0` as its runtime dependency.
- [x] Prepare `packages/kit/package.json` for npm distribution with core API
      re-exports, a `stampy` bin that launches Studio, and dependencies on
      `@stampy/core@0.1.0` and `@stampy/studio@0.1.0`.
- [x] Run `pnpm test`.
- [x] Run `pnpm check`.
- [x] Run `pnpm build`.
- [x] Run `pnpm pack:core`.
- [x] Run `pnpm verify:core-consumer`.
      This installs `tmp/stampy-core-0.1.0.tgz` into a temporary external app
      and verifies the public package entry, JSON helpers, SVG rendering, and
      CSS export.
- [x] Run `pnpm release:core:check`.
      This wraps tests, type checks, builds, package packing, and external
      consumer verification as a single release gate.
- [x] Run `pnpm release:studio:check`.
      This wraps Studio tests, type checks, static build, package packing, CLI
      smoke testing, and external consumer verification against the packed
      tarball.
- [x] Run `pnpm release:kit:check`.
      This wraps Kit tests, type checks, package packing, runtime API
      verification, CSS file verification, and Studio launcher verification
      from an external consumer project.
- [x] Inspect `tmp/stampy-core-*.tgz`.
      The generated tarball contained `dist`, `README.md`, `LICENSE`, and
      `package.json`, without test files.
- [x] Run `pnpm --filter @stampy/core publish --access public --dry-run`.
      Confirmed dry-run publish for `@stampy/core@0.1.0`.
- [x] Publish only after npm account access and the first release version are
      approved. The owner will perform the real npm publish.
- [ ] Follow `docs/npm-publish.md` for the first manual npm release.

## Product

- [x] Verify Studio at `http://localhost:4321/`.
      Confirmed with Chrome/Playwright on 2026-06-27.
- [x] Verify the vanilla example at `http://127.0.0.1:5173/`.
      Confirmed with Chrome/Playwright on 2026-06-27.
- [x] Export SVG, PNG, and project JSON from Studio.
      Confirmed SVG text output, a non-empty PNG download, and project JSON.
- [x] Import the exported project JSON back into Studio.
      Confirmed restored stamp text, locale, theme, and animation preset.
- [x] Check light/dark mode and English/Japanese UI.
      Confirmed Japanese UI text and dark theme state.
- [x] Re-run `docs/competitive-scan.md` before public announcement.
      Re-checked npm and web search results on 2026-06-27.
