#!/usr/bin/env node
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const args = parseArgs(process.argv.slice(2));
const host = args.host ?? process.env.HOST ?? "127.0.0.1";
const requestedPort = Number(args.port ?? process.env.PORT ?? 4321);

if (!existsSync(join(root, "index.html"))) {
  console.error(
    "Stampy Studio is missing its static dist files. Reinstall @stampy/studio or run `pnpm --filter @stampy/studio build` in the repository.",
  );
  process.exit(1);
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${host}`);
  const pathname = decodeURIComponent(url.pathname);
  const filePath = resolveFile(pathname);

  if (!filePath) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "cache-control": pathname.startsWith("/_astro/")
      ? "public, max-age=31536000, immutable"
      : "no-cache",
    "content-type": contentType(filePath),
  });
  createReadStream(filePath).pipe(response);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && requestedPort !== 0) {
    const nextPort = requestedPort + 1;
    console.warn(`Port ${requestedPort} is in use. Trying ${nextPort}.`);
    server.listen(nextPort, host);
    return;
  }

  console.error(error.message);
  process.exit(1);
});

server.listen(requestedPort, host, () => {
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : requestedPort;
  console.log(`Stampy Studio is running at http://${host}:${port}/`);
});

function parseArgs(values) {
  const parsed = {};

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (value === "--help" || value === "-h") {
      printHelp();
      process.exit(0);
    }

    if (value === "--host") {
      parsed.host = values[index + 1];
      index += 1;
      continue;
    }

    if (value.startsWith("--host=")) {
      parsed.host = value.slice("--host=".length);
      continue;
    }

    if (value === "--port" || value === "-p") {
      parsed.port = values[index + 1];
      index += 1;
      continue;
    }

    if (value.startsWith("--port=")) {
      parsed.port = value.slice("--port=".length);
    }
  }

  return parsed;
}

function resolveFile(pathname) {
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const candidate = join(root, safePath === "/" ? "index.html" : safePath);
  const relativePath = relative(root, candidate);

  if (relativePath.startsWith("..") || relativePath === "") {
    return join(root, "index.html");
  }

  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate;
  }

  return null;
}

function contentType(filePath) {
  switch (extname(filePath)) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

function printHelp() {
  console.log(`Stampy Studio

Usage:
  stampy-studio [--host 127.0.0.1] [--port 4321]

Options:
  --host <host>  Host to bind. Defaults to 127.0.0.1.
  --port, -p     Port to bind. Defaults to 4321. Use 0 for a random port.
  --help, -h     Show this help.
`);
}
