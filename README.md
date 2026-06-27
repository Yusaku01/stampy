# Stampy

Stampy is a lightweight toolkit for making SVG stamp marks, press animations,
and local stamp-book state for static sites and small web apps.

The project is split into two parts:

- `@stampy/core`: dependency-free TypeScript helpers and Web Components.
- `@stampy/studio`: a localhost Astro Studio for editing, previewing, and exporting stamps.

## Goals

- Keep the embeddable runtime small and framework-agnostic.
- Make stamp graphics editable as structured data, not as one-off images.
- Let teams customize the stamp-press animation with presets or their own animator.
- Support SVG and PNG export from a local Studio.

## OSS Readiness

- `CONTRIBUTING.md` explains local setup, validation, and development principles.
- `SECURITY.md` defines the current pre-1.0 security reporting posture.
- `docs/competitive-scan.md` records why this project is differentiated enough
  to proceed.
- `docs/studio-guide.md` explains the local GUI workflow for editing,
  previewing, importing, and exporting stamps.
- `docs/project-schema.md` documents the portable Stampy Project JSON format.
- `docs/release-checklist.md` lists the remaining repository and npm publication
  gates.
- `.github/workflows/ci.yml` runs tests, type checks, builds, and package
  packing on pull requests and pushes to `main`.

## Quick Start

```sh
pnpm install
pnpm dev
```

Open the local Studio URL printed by Astro.

See `docs/studio-guide.md` for the GUI workflow, including SVG/PNG export,
Project JSON import/export, language/theme options, and press animation
previewing.

Run the framework-free embed example:

```sh
pnpm --filter @stampy/vanilla-example build
pnpm --filter @stampy/vanilla-example exec vite --host 127.0.0.1
```

## Stack

- Astro powers the local Studio and keeps the app static-first.
- `@stampy/core` is dependency-free TypeScript and uses DOM/SVG/Web Component APIs.
- The Studio uses the same core package as embedders, so exported data matches runtime behavior.
- View Transitions are enabled in the Studio shell for future multi-screen editing flows.

## Embedding

After the first npm release, install the runtime package in a web app:

```sh
pnpm add @stampy/core
```

Until then, use this repository locally with the included Studio and examples.

```html
<stampy-mark
  main-text="Visited"
  sub-text="My Guide"
  date-text="2026.06.27"
  ink="#b93632"
></stampy-mark>
```

```ts
import {
  registerStampyElements,
  installStampyAnimations,
  pressStamp,
} from "@stampy/core";

registerStampyElements();
installStampyAnimations();

const stamp = document.querySelector("stampy-mark");
await pressStamp(stamp, { preset: "classic" });
```

See `examples/vanilla` for a complete framework-free Vite integration
using Web Components, project JSON, built-in press motion, and a custom animator.

## Project Data

Stampy Studio can export a project JSON file that contains the stamp design,
animation settings, language, and theme. The same JSON can be imported back into
Studio or stored in another application.

```json
{
  "schemaVersion": 1,
  "name": "Onsen visit stamp",
  "locale": "ja",
  "theme": "auto",
  "stamp": {
    "id": "studio-stamp",
    "shape": "circle",
    "mainText": "入湯済",
    "subText": "東葛湯巡り",
    "dateText": "2026.06.27",
    "ink": "#b93632",
    "paper": "#fffaf4",
    "icon": "steam",
    "distress": 0.72,
    "roughen": 2.25,
    "rotate": -6
  },
  "animation": {
    "preset": "classic",
    "durationMs": 780,
    "intensity": 1
  },
  "updatedAt": "2026-06-27T00:00:00.000Z"
}
```

Use the core helpers when you want to keep this data in your own app:

```ts
import {
  createStampyProject,
  parseStampyProject,
  serializeStampyProject,
} from "@stampy/core";

const project = createStampyProject({
  name: "Cafe reward stamp",
  stamp: {
    mainText: "Reward",
    subText: "Coffee Club",
  },
  animation: {
    preset: "ink",
  },
});

localStorage.setItem("stampy-project", serializeStampyProject(project));

const restored = parseStampyProject(
  localStorage.getItem("stampy-project") ?? "",
);
```

See `docs/project-schema.md` for the schema contract and
`examples/toukatsu-yumeguri.project.json` for a Japanese visit-stamp sample.

## Custom Press Animations

Built-in presets are `classic`, `bounce`, `ink`, and `none`. To fully own the
motion, pass a custom animator:

```ts
await pressStamp(stamp, {
  preset: "classic",
  durationMs: 900,
  animator: async (element, context) => {
    const animation = element.animate(
      [
        { transform: "translateY(-42px) scale(1.5)", opacity: 0 },
        { transform: "translateY(0) scale(1)", opacity: 1 },
      ],
      {
        duration: context.durationMs,
        easing: "cubic-bezier(.2,.8,.2,1)",
      },
    );

    await animation.finished;
  },
});
```

## Light, Dark, and i18n

The Studio supports English and Japanese UI copy, plus `auto`, `light`, and
`dark` themes. Exported embed snippets include a dark-mode media query, and the
project JSON stores the selected locale/theme so a downstream app can respect
the same choices.

## Current Scope

This first OSS slice intentionally focuses on:

- SVG stamp design and rendering.
- Press-animation presets and custom animation hooks.
- Project JSON import/export.
- SVG/PNG image export from localhost Studio.
- Framework-agnostic embedding through Web Components.

It does not yet include cloud sync, accounts, marketplace distribution, or a
hosted gallery. Those can be layered on without changing the core data shape.

## Release Checks

Before publishing `@stampy/core`, run:

```sh
pnpm test
pnpm check
pnpm build
pnpm pack:core
```

`pnpm pack:core` writes the package tarball to `tmp/` so the contents can be
inspected before npm publication.
