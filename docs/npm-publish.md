# npm Publish Guide

Use this guide when publishing `@stampy/core` for the first time.

Publishing is intentionally not automated yet because the first npm publish
claims the package name and cannot be treated like a normal reversible commit.

## Preconditions

- The repository is public: `https://github.com/Yusaku01/stampy`.
- The default branch CI is green.
- `@stampy/core` has `publishConfig.access` set to `public`.
- The npm package name is still available or publishable by the active npm
  account.

Check the package name:

```sh
npm view @stampy/core version
```

An `E404` result means the package is not publicly readable. It may still
require npm account or organization permission before publishing.

Check the active npm account:

```sh
npm whoami
```

As of 2026-06-27, this repository's local environment returned
`E401 Unauthorized` for `npm whoami`, so the first publish requires logging in
to npm before continuing.

## Prepare The Release

1. Choose the first release version.

   For example, `0.1.0` is a reasonable first public pre-1.0 release.

2. Update `packages/core/package.json`.

   ```json
   {
     "version": "0.1.0"
   }
   ```

3. Run the full local release check.

   ```sh
   pnpm release:core:check
   ```

   This runs tests, type checks, builds, package packing, and an external
   consumer smoke test against the packed tarball.

4. Inspect the tarball.

   ```sh
   tar -tzf tmp/stampy-core-*.tgz | sort
   ```

   Expected contents:

   - `package/LICENSE`
   - `package/README.md`
   - `package/package.json`
   - `package/dist/**`

## Publish

Only publish after the version and npm account have been approved.

```sh
pnpm --filter @stampy/core publish --access public
```

If using npm provenance from GitHub Actions later, move publishing into a
dedicated release workflow instead of publishing manually from a local machine.

## After Publishing

1. Confirm npm can read the package.

   ```sh
   npm view @stampy/core version
   ```

2. Update the root README install section if it still says "After the first npm
   release".

3. Tag the release in git.

   ```sh
   git tag @stampy/core@0.1.0
   git push origin @stampy/core@0.1.0
   ```

4. Update `docs/release-checklist.md` with the published version and npm URL.
