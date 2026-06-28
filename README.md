# Stampy

Stampy is a lightweight toolkit for making SVG stamp marks, press animations,
and local stamp-book state for static sites and small web apps.

The project is split into three packages:

- `@stampy/kit`: all-in-one package with the runtime API and local Studio launcher.
- `@stampy/core`: dependency-free TypeScript helpers and Web Components.
- `@stampy/studio`: a localhost Astro Studio for editing, previewing, and exporting stamps.

## Why Use Stampy?

- Embed lightweight stamp marks without tying your app to a framework.
- Keep stamp graphics editable as structured data instead of one-off images.
- Customize stamp-press motion with presets or your own animator.
- Export SVG, PNG, and reusable project JSON from a local Studio.

## Quick Start

Install the all-in-one package:

```sh
npm install @stampy/kit
```

Use the runtime API:

```ts
import { renderStampSvg } from "@stampy/kit";
import "@stampy/kit/styles.css";
```

Launch the local Studio:

```sh
npx stampy
```

Launch the local Studio without cloning this repository:

```sh
npx @stampy/studio
```

Or keep Studio as a project dev tool:

```sh
npm install -D @stampy/studio
npx stampy-studio
```

```sh
pnpm add -D @stampy/studio
pnpm exec stampy-studio
```

Use the runtime package in an app:

```sh
npm install @stampy/core
```

Work on this repository locally:

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
