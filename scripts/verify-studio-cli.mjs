import { spawn } from "node:child_process";

const command = process.argv[2] ?? process.execPath;
const args =
  process.argv.length > 2
    ? process.argv.slice(3)
    : ["packages/studio/bin/stampy-studio.mjs"];

const child = spawn(
  command,
  [...args, "--host", "127.0.0.1", "--port", "0"],
  {
    cwd: new URL("..", import.meta.url),
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let output = "";
let settled = false;

const timeout = setTimeout(() => {
  finish(new Error("Timed out waiting for Stampy Studio CLI to start."));
}, 5000);

child.stdout.setEncoding("utf8");
child.stderr.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  output += chunk;
  const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)\//);

  if (match) {
    verify(Number(match[1])).catch(finish);
  }
});
child.stderr.on("data", (chunk) => {
  output += chunk;
});
child.on("exit", (code) => {
  if (!settled) {
    finish(new Error(`Stampy Studio CLI exited before verification. Code: ${code}\n${output}`));
  }
});

async function verify(port) {
  const response = await fetch(`http://127.0.0.1:${port}/`);
  const html = await response.text();

  if (!response.ok || !html.includes("Stampy")) {
    throw new Error(`Unexpected Studio response: ${response.status}`);
  }

  console.log("Stampy Studio CLI smoke test passed.");
  finish();
}

function finish(error) {
  if (settled) {
    return;
  }

  settled = true;
  clearTimeout(timeout);
  child.kill("SIGTERM");

  if (error) {
    console.error(error.message);
    process.exitCode = 1;
  }

  setTimeout(() => {
    process.exit(error ? 1 : 0);
  }, 50);
}
