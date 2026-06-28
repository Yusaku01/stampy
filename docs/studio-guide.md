# Stampy Studio Guide

Stampy Studio is the local GUI for designing stamp artwork, previewing press
motion, and exporting assets or project data. It is intentionally local-first:
no account, cloud sync, or remote storage is required.

## Start Studio

Use the npm package:

```sh
npx @stampy/studio
```

If your project already uses the all-in-one kit:

```sh
npm install @stampy/kit
npx stampy
```

Or add Studio to your project as a dev tool:

```sh
npm install -D @stampy/studio
npx stampy-studio
```

```sh
pnpm add -D @stampy/studio
pnpm exec stampy-studio
```

Or start it from this repository:

```sh
pnpm install
pnpm dev
```

Open the Astro URL printed in the terminal, usually `http://localhost:4321/`.

## Design A Stamp

Use the Stamp panel to edit:

- Main text, sub text, and date text.
- Shape: `circle`, `ticket`, or `rounded`.
- Icon: `steam`, `star`, `spark`, or `none`.
- Ink and paper colors.
- Distress, roughen, and rotation.

The preview updates as fields change. The generated stamp is SVG-based and uses
the same renderer as `@stampy/core`, so Studio output should match embedded
runtime output.

## Preview Press Motion

Use the Animation panel to choose a press preset:

- `classic`: a straightforward stamp-down motion.
- `bounce`: a more playful press and rebound.
- `ink`: a softer ink-reveal feel.
- `none`: no press motion.

Duration and intensity are stored in the exported project JSON. The Studio also
shows a custom animator API example so app developers can replace preset motion
with their own Web Animations implementation.

## Export Assets

Studio can write:

- SVG: use `Export SVG`.
- PNG: use `PNG` in the preview toolbar. The current export size is 1024px.
- Project JSON: use `Export JSON`.
- Embed snippet: use `Copy embed`.
- Project JSON clipboard text: use `Copy JSON`.

Use SVG or PNG when a static image is enough. Use Project JSON when the stamp
should stay editable or when another app should reuse the same design and
animation settings.

## Import Project JSON

Use `Import JSON` to load a `stampy-project.json` file exported from Studio or
created with `createStampyProject` from `@stampy/core`.

Studio validates the schema version and normalizes the design, animation,
locale, and theme through the core package. Unsupported schema versions are
rejected instead of silently changing data.

## Language And Theme

Studio supports:

- Language: English and Japanese.
- Theme: `auto`, `light`, and `dark`.

The selected values are stored in Project JSON so downstream apps can respect
the same user intent.

## Embedding In Another App

For the smallest runtime integration, register the Web Component and copy the
generated `<stampy-mark>` snippet:

```ts
import {
  installStampyAnimations,
  pressStamp,
  registerStampyElements,
} from "@stampy/core";
import "@stampy/core/styles.css";

registerStampyElements();
installStampyAnimations();

const stamp = document.querySelector("stampy-mark");
await pressStamp(stamp, { preset: "classic" });
```

For a richer integration, store the exported Project JSON and hydrate it in the
host app with `parseStampyProject`.
