import { spawn } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
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
const kitPackage = await import(new URL("../packages/kit/package.json", import.meta.url), {
  with: { type: "json" },
});

const tempDir = await mkdtemp(join(tmpdir(), "stampy-kit-consumer-"));
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
const kitTarball = new URL(
  `../tmp/stampy-kit-${kitPackage.default.version}.tgz`,
  import.meta.url,
);

await run("npm", ["init", "-y"], appDir);
await run(
  "npm",
  [
    "install",
    coreTarball.pathname,
    studioTarball.pathname,
    kitTarball.pathname,
    "--ignore-scripts",
    "--prefer-offline",
    "--no-audit",
    "--no-fund",
  ],
  appDir,
);

await writeFile(
  join(appDir, "verify.mjs"),
  `import { readFile } from "node:fs/promises";
import { createStampyProject, renderStampSvg } from "@stampy/kit";

const project = createStampyProject({
  stamp: { mainText: "KIT" }
});
const svg = renderStampSvg(project.stamp);

if (!svg.includes("KIT")) {
  throw new Error("Expected @stampy/kit to render SVG through @stampy/core.");
}

const css = await readFile(new URL("./node_modules/@stampy/kit/styles.css", import.meta.url), "utf8");

if (!css.includes("stampy-mark")) {
  throw new Error("Expected @stampy/kit/styles.css to include Stampy styles.");
}
`,
);
await run(process.execPath, ["verify.mjs"], appDir);
await run(
  process.execPath,
  [
    new URL("verify-studio-cli.mjs", import.meta.url).pathname,
    join(appDir, "node_modules/.bin/stampy"),
  ],
  repoRoot,
);

console.log("External Kit consumer smoke test passed.");

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(" ")}`);
    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`${command} ${args.join(" ")} timed out\n${output}`));
    }, 120000);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("exit", (code) => {
      clearTimeout(timeout);

      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}\n${output}`));
    });
  });
}
