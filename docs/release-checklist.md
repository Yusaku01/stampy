# Release Checklist

Use this before publishing the first public repository or npm package.

## Repository

- [x] Choose the public repository URL:
      `https://github.com/Yusaku01/stampy`.
- [x] Add the repository URL to `packages/core/package.json`.
- [ ] Confirm `README.md`, `LICENSE`, `CONTRIBUTING.md`, and `SECURITY.md` render
      correctly on GitHub.
- [x] Add the GitHub repository description and topics.
- [x] Enable branch protection for `main`.
      Required status check: `Test, typecheck, build, and pack`.
- [x] Confirm the GitHub Actions CI workflow passes on the default branch.
      Latest confirmed run: `28290637089`, success on 2026-06-27.

## Package

- [ ] Confirm the npm package name and scope. `npm view @stampy/core` returned
      `E404` on 2026-06-27, which means the package was not publicly readable at
      that time; final availability still depends on npm account/scope access.
- [ ] Update `packages/core/package.json` from `0.0.0` to the intended release
      version.
- [x] Run `pnpm test`.
- [x] Run `pnpm check`.
- [x] Run `pnpm build`.
- [x] Run `pnpm pack:core`.
- [x] Run `pnpm verify:core-consumer`.
      This installs `tmp/stampy-core-0.0.0.tgz` into a temporary external app
      and verifies the public package entry, JSON helpers, SVG rendering, and
      CSS export.
- [x] Run `pnpm release:core:check`.
      This wraps tests, type checks, builds, package packing, and external
      consumer verification as a single release gate.
- [x] Inspect `tmp/stampy-core-*.tgz`.
- [ ] Publish only after the tarball contains `dist`, `README.md`, `LICENSE`,
      and `package.json`, without test files.
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
