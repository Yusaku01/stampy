# @stampy/studio

Local Studio for designing Stampy stamp artwork, previewing press motion, and
exporting SVG, PNG, Project JSON, or an embed snippet.

## Usage

```sh
npx @stampy/studio
```

Or install it in a project:

```sh
npm install -D @stampy/studio
npx stampy-studio
```

```sh
pnpm add -D @stampy/studio
pnpm exec stampy-studio
```

The CLI serves the static Studio locally. By default it uses
`http://127.0.0.1:4321/`.

```sh
stampy-studio --host 127.0.0.1 --port 4321
```

The exported Project JSON can be used with `@stampy/core`.
