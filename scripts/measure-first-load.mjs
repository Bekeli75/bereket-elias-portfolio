import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const raw = process.argv.slice(2);
const args = {};
for (let i = 0; i < raw.length; i++) {
  const arg = raw[i];
  if (!arg.startsWith("--")) continue;
  const [key, value] = arg.slice(2).split("=");
  if (value !== undefined) args[key] = value;
  else if (raw[i + 1] && !raw[i + 1].startsWith("--")) args[key] = raw[++i];
  else args[key] = true;
}

const manifest = JSON.parse(
  readFileSync(".next/app-build-manifest.json", "utf8"),
);

const route = args.route || "/page";
const maxKb = args["max-kb"] ? Number(args["max-kb"]) : null;
const list = manifest.pages[route] || [];

let total = 0;
for (const asset of list) {
  const file = join(".next", asset);
  statSync(file);
  total += gzipSync(readFileSync(file)).length;
}

console.log(`Route: ${route}`);
console.log(
  `Scripts: ${list.filter((a) => a.endsWith(".js")).length}, gzip total: ${total} bytes (${(total / 1024).toFixed(1)} kB)`,
);

if (maxKb) {
  const kb = total / 1024;
  if (kb > maxKb) {
    console.error(`Budget exceeded: ${kb.toFixed(1)} kB > ${maxKb} kB`);
    process.exit(1);
  }
  console.log(`Budget ${maxKb} kB: OK`);
}