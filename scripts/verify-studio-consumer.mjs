import { spawn } from "node:child_process";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const corePackage = await import(new URL("../packages/core/package.json", import.meta.url), {
  with: { type: "json" },
});
const studioPackage = await import(new URL("../packages/studio/package.json", import.meta.url), {
  with: { type: "json" },
});

const tempDir = await mkdtemp(join(tmpdir(), "stampy-studio-consumer-"));
const appDir = join(tempDir, "app");
await mkdir(appDir);

const coreTarball = new URL(
  `../tmp/stampy-core-${corePackage.default.version}.tgz`,
  import.meta.url,
);
const studioTarball = new URL(
  `../tmp/stampy-studio-${studioPackage.default.version}.tgz`,
  import.meta.url,
);

await run("npm", ["init", "-y"], appDir);
await run(
  "npm",
  ["install", coreTarball.pathname, studioTarball.pathname, "--ignore-scripts"],
  appDir,
);
await run(
  process.execPath,
  [
    new URL("verify-studio-cli.mjs", import.meta.url).pathname,
    process.execPath,
    join(appDir, "node_modules/.bin/stampy-studio"),
  ],
  repoRoot,
);

console.log("External Studio consumer smoke test passed.");

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}\n${output}`));
    });
  });
}
