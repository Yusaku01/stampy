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
      Latest confirmed run: `28289917212`, success on 2026-06-27.

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
- [x] Inspect `tmp/stampy-core-*.tgz`.
- [ ] Publish only after the tarball contains `dist`, `README.md`, `LICENSE`,
      and `package.json`, without test files.

## Product

- [ ] Verify Studio at `http://localhost:4321/`.
- [ ] Verify the vanilla example at `http://127.0.0.1:5173/`.
- [ ] Export SVG, PNG, and project JSON from Studio.
- [ ] Import the exported project JSON back into Studio.
- [ ] Check light/dark mode and English/Japanese UI.
- [ ] Re-run `docs/competitive-scan.md` before public announcement.
