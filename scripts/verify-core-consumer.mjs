import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const corePackage = JSON.parse(
  await readFile(join(root, "packages", "core", "package.json"), "utf8"),
);
const tarball = join(root, "tmp", `stampy-core-${corePackage.version}.tgz`);

const run = (command, args, options = {}) =>
  new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? root,
      stdio: "inherit",
      env: {
        ...process.env,
        npm_config_yes: "true",
      },
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolveRun();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });

const consumer = await mkdtemp(join(tmpdir(), "stampy-consumer-"));

try {
  try {
    await access(tarball);
  } catch {
    await run("pnpm", ["pack:core"]);
  }

  await writeFile(
    join(consumer, "package.json"),
    JSON.stringify(
      {
        private: true,
        type: "module",
        dependencies: {
          "@stampy/core": tarball,
        },
      },
      null,
      2,
    ),
  );

  await writeFile(
    join(consumer, "verify.mjs"),
    `import {
  createStampyProject,
  renderStampSvg,
  serializeStampyProject,
} from "@stampy/core";
import { readFile } from "node:fs/promises";

const project = createStampyProject({
  name: "Consumer smoke test",
  locale: "en",
  theme: "auto",
  stamp: {
    mainText: "Visited",
    subText: "External App",
    dateText: "2026.06.27",
    ink: "#b93632",
  },
  animation: {
    preset: "bounce",
    durationMs: 820,
  },
});

const svg = renderStampSvg(project.stamp);
const json = serializeStampyProject(project);
const styles = await readFile(
  new URL("./node_modules/@stampy/core/dist/styles.css", import.meta.url),
  "utf8",
);

if (!svg.includes("<svg") || !svg.includes("External App")) {
  throw new Error("renderStampSvg did not produce expected SVG output.");
}

if (!json.includes('"preset": "bounce"')) {
  throw new Error("serializeStampyProject did not preserve animation data.");
}

if (!styles.includes(".stampy-mark")) {
  throw new Error("@stampy/core/styles.css export is missing expected CSS.");
}

console.log("External consumer smoke test passed.");
`,
  );

  await run("npm", ["install", "--ignore-scripts"], { cwd: consumer });
  await run("node", ["verify.mjs"], { cwd: consumer });
} finally {
  await rm(consumer, { recursive: true, force: true });
}
