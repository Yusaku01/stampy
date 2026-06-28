# Stampy

Stampy is a lightweight toolkit for making SVG stamp marks, press animations,
and local stamp-book state for static sites and small web apps.

The project is split into two parts:

- `@stampy/core`: dependency-free TypeScript helpers and Web Components.
- `@stampy/studio`: a localhost Astro Studio for editing, previewing, and exporting stamps.

## Why Use Stampy?

- Embed lightweight stamp marks without tying your app to a framework.
- Keep stamp graphics editable as structured data instead of one-off images.
- Customize stamp-press motion with presets or your own animator.
- Export SVG, PNG, and reusable project JSON from a local Studio.

## Quick Start

```sh
pnpm install
pnpm dev
```

Open the local Studio URL printed by Astro.

See the [Studio guide](docs/studio-guide.md) for the GUI workflow, including
SVG/PNG export, Project JSON import/export, language/theme options, and press
animation previewing.

Run the framework-free embed example:

```sh
pnpm --filter @stampy/vanilla-example build
pnpm --filter @stampy/vanilla-example exec vite --host 127.0.0.1
```

## Tech Stack

- Astro powers the local Studio and keeps the app static-first.
- `@stampy/core` is dependency-free TypeScript and uses DOM/SVG/Web Component APIs.
- The Studio uses the same core package as embedders, so exported data matches runtime behavior.
- View Transitions are enabled in the Studio shell for future multi-screen editing flows.

## Learn More

- [@stampy/core README](packages/core/README.md) covers the runtime API, Web
  Component, export helpers, Project JSON helpers, and press animations.
- [Studio guide](docs/studio-guide.md) covers the local Studio workflow.
- [Project schema](docs/project-schema.md) documents the portable Stampy
  Project JSON format.
- [Vanilla example](examples/vanilla) shows a framework-free Vite integration.
