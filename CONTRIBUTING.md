# Contributing

Thanks for helping make Stampy easier to embed, edit, and maintain.

## Local Setup

```sh
pnpm install
pnpm dev
```

The Studio runs from `packages/studio`. The embeddable runtime lives in
`packages/core`.

## Validation

Run the same checks as CI before opening a pull request:

```sh
pnpm test
pnpm check
pnpm build
pnpm pack:core
```

## Development Principles

- Keep `@stampy/core` framework-agnostic and dependency-light.
- Put authoring UI in `packages/studio`; put reusable rendering/data/motion logic in
  `packages/core`.
- Treat the Stampy Project JSON schema as a public contract.
- Prefer small, composable APIs over app-specific shortcuts.
- Keep examples runnable and close to real embedder usage.

## Commit Style

Use concise Conventional Commit messages when committing changes, such as:

```text
feat: add project json import
fix: preserve default stamp values
docs: explain custom animator api
```
