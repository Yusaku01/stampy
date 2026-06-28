import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";

const coreEntry = fileURLToPath(
  new URL("../../packages/core/src/index.ts", import.meta.url),
);

export default defineConfig({
  vite: {
    resolve: {
      alias: [
        {
          find: /^@stampy\/core$/,
          replacement: coreEntry,
        },
      ],
    },
    server: {
      fs: {
        allow: ["../.."],
      },
    },
  },
});
