#!/usr/bin/env node
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);

if (args[0] === "--help" || args[0] === "-h") {
  printHelp();
  process.exit(0);
}

const studioArgs = args[0] === "studio" ? args.slice(1) : args;
const studioPackagePath = require.resolve("@stampy/studio/package.json");
const studioBin = join(dirname(studioPackagePath), "bin/stampy-studio.mjs");
const child = spawn(process.execPath, [studioBin, ...studioArgs], {
  stdio: "inherit",
});

process.on("SIGINT", () => {
  child.kill("SIGINT");
});

process.on("SIGTERM", () => {
  child.kill("SIGTERM");
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

function printHelp() {
  const self = fileURLToPath(import.meta.url);

  console.log(`Stampy

Usage:
  stampy [studio] [--host 127.0.0.1] [--port 4321]

Commands:
  studio       Start the local Stampy Studio. This is the default command.

Options:
  --host       Host to bind. Defaults to 127.0.0.1.
  --port, -p   Port to bind. Defaults to 4321.
  --help, -h   Show this help.

Binary:
  ${self}
`);
}
